import {
    getPendingSyncItems,
    markSyncing,
    markSynced,
    markSyncFailed,
} from "@/lib/sync/syncQueue";

import { updateFormSyncStatus } from "@/lib/db/indexedDB";
import { createAuditLog } from "@/lib/sync/auditLog";

let isSyncing = false;
const BASE_DELAY = 1000;
const MAX_RETRIES = 5;

function calculateRetryDelay(retryCount) {
    return BASE_DELAY * Math.pow(2, retryCount);
}

function wait(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function syncTransaction(item) {
    try {
        console.log("🚀 Starting sync:", item.id);

        await markSyncing(item.id);
        await updateFormSyncStatus(item.formId, "SYNCING");

        await createAuditLog({
            transactionId: item.id,
            formId: item.formId,
            event: "SYNC_STARTED",
            status: "SYNCING",
            retryCount: item.retryCount || 0,
        });

        if (!navigator.onLine) {
            throw new Error("Internet connection lost before API request.");
        }

        const response = await fetch("/api/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                transactionId: item.id,
                formId: item.formId,
                operation: item.operation,
                payload: item.payload,
                priority: item.priority,
            }),
        });

        const text = await response.text();
        let data = null;
        try {
            data = text ? JSON.parse(text) : null;
        } catch {
            data = { raw: text };
        }

        console.log("🌐 API response:", response.status, data);

        if (!response.ok || data?.success !== true) {
            throw new Error(data?.message || `Server returned ${response.status}`);
        }

        // Only after server confirmation do we mark everything as SYNCED.
        await markSynced(item.id);
        await updateFormSyncStatus(item.formId, "SYNCED");

        await createAuditLog({
            transactionId: item.id,
            formId: item.formId,
            event: "SYNC_COMPLETED",
            status: "SYNCED",
            retryCount: item.retryCount || 0,
        });

        console.log("✅ SYNCED:", item.id);
        return { success: true };
    } catch (error) {
        console.error("❌ Sync failed:", item.id, error);

        const retryCount = item.retryCount || 0;

        if (retryCount >= MAX_RETRIES) {
            await markSyncFailed(item.id, error.message);
            await updateFormSyncStatus(item.formId, "FAILED");

            await createAuditLog({
                transactionId: item.id,
                formId: item.formId,
                event: "SYNC_FAILED",
                status: "FAILED",
                message: error.message,
                retryCount,
            });

            return { success: false, permanentlyFailed: true };
        }

        const delay = calculateRetryDelay(retryCount);
        console.log(`🔁 Retrying ${item.id} in ${delay}ms`);
        await wait(delay);

        return syncTransaction({
            ...item,
            retryCount: retryCount + 1,
        });
    }
}

export async function processSyncQueue() {
    if (isSyncing) {
        console.log("Sync already running. Skipping duplicate call.");
        return { success: true, synced: 0, reason: "already-syncing" };
    }

    if (typeof navigator === "undefined" || !navigator.onLine) {
        console.log("📴 Offline - sync skipped.");
        return { success: false, synced: 0, reason: "offline" };
    }

    isSyncing = true;

    try {
        const pendingItems = await getPendingSyncItems();

        console.log("🔎 Pending sync items:", pendingItems);
        console.log("🔢 Pending count:", pendingItems.length);

        if (pendingItems.length === 0) {
            console.log("No pending sync items.");
            return { success: true, synced: 0 };
        }

        const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
        pendingItems.sort(
            (a, b) =>
                (priorityOrder[a.priority] || 2) -
                (priorityOrder[b.priority] || 2)
        );

        let syncedCount = 0;

        for (const item of pendingItems) {
            if (!navigator.onLine) {
                console.log("📴 Internet disconnected during sync.");
                break;
            }

            const result = await syncTransaction(item);
            if (result.success) syncedCount++;
        }

        console.log(`✅ Sync completed. ${syncedCount} item(s) synced.`);

        return {
            success: true,
            synced: syncedCount,
            total: pendingItems.length,
        };
    } finally {
        isSyncing = false;
    }
}
