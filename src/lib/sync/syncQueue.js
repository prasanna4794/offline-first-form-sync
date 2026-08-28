const STORE_NAME = "syncQueue";

export async function openSyncQueueDB() {
    const { openDatabase } = await import("@/lib/db/indexedDB");
    return openDatabase();
}

function dispatchDashboardUpdate() {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("dashboard-stats-updated"));
    }
}

export async function addToSyncQueue({
    id,
    formId,
    operation = "CREATE",
    payload,
    priority = "MEDIUM",
}) {
    const database = await openSyncQueueDB();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const now = new Date().toISOString();
        const queueItem = {
            id,
            formId,
            operation,
            payload,
            priority,
            status: "PENDING",
            retryCount: 0,
            createdAt: now,
            updatedAt: now,
        };

        const request = store.put(queueItem);
        request.onsuccess = () => {
            dispatchDashboardUpdate();
            resolve(queueItem);
        };
        request.onerror = () => reject(request.error);
    });
}

/*
 * A page refresh can interrupt a transaction after it has been marked SYNCING.
 * Such an item must not remain stuck forever. After STALE_AFTER_MS it is safe
 * to put it back into PENDING so the next online sync can retry it.
 */
const STALE_AFTER_MS = 30 * 1000;

export async function recoverStaleSyncItems() {
    const database = await openSyncQueueDB();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        const now = Date.now();
        let recovered = 0;

        request.onsuccess = () => {
            for (const item of request.result) {
                if (item.status !== "SYNCING") continue;

                const updatedAt = Date.parse(item.updatedAt || item.createdAt || "");
                if (!Number.isFinite(updatedAt) || now - updatedAt < STALE_AFTER_MS) {
                    continue;
                }

                item.status = "PENDING";
                item.updatedAt = new Date().toISOString();
                item.error = null;
                store.put(item);
                recovered++;
            }
        };

        transaction.oncomplete = () => {
            if (recovered > 0) dispatchDashboardUpdate();
            resolve(recovered);
        };
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error || new Error("Transaction aborted"));
    });
}

export async function getPendingSyncItems() {
    await recoverStaleSyncItems();
    const database = await openSyncQueueDB();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result.filter((item) => item.status === "PENDING"));
        };
        request.onerror = () => reject(request.error);
    });
}

async function updateSyncStatus(id, status) {
    const database = await openSyncQueueDB();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => {
            const item = request.result;
            if (!item) {
                resolve(null);
                return;
            }

            item.status = status;
            item.updatedAt = new Date().toISOString();

            const updateRequest = store.put(item);
            updateRequest.onsuccess = () => {
                dispatchDashboardUpdate();
                resolve(item);
            };
            updateRequest.onerror = () => reject(updateRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

export function markSyncing(id) {
    return updateSyncStatus(id, "SYNCING");
}

export function markSynced(id) {
    return updateSyncStatus(id, "SYNCED");
}

export async function markSyncFailed(id, errorMessage) {
    const database = await openSyncQueueDB();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => {
            const item = request.result;
            if (!item) {
                resolve(null);
                return;
            }

            item.status = "FAILED";
            item.error = errorMessage;
            item.updatedAt = new Date().toISOString();

            const updateRequest = store.put(item);
            updateRequest.onsuccess = () => {
                dispatchDashboardUpdate();
                resolve(item);
            };
            updateRequest.onerror = () => reject(updateRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}

export async function getAllSyncItems() {
    const database = await openSyncQueueDB();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, "readonly");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function deleteSyncItem(id) {
    const database = await openSyncQueueDB();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);
        request.onsuccess = () => {
            dispatchDashboardUpdate();
            resolve(true);
        };
        request.onerror = () => reject(request.error);
    });
}

export async function retrySyncItem(id) {
    const database = await openSyncQueueDB();

    return new Promise((resolve, reject) => {
        const transaction = database.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => {
            const item = request.result;
            if (!item) {
                resolve(null);
                return;
            }

            item.status = "PENDING";
            item.retryCount = 0;
            item.error = null;
            item.updatedAt = new Date().toISOString();

            const updateRequest = store.put(item);
            updateRequest.onsuccess = () => {
                dispatchDashboardUpdate();
                resolve(item);
            };
            updateRequest.onerror = () => reject(updateRequest.error);
        };
        request.onerror = () => reject(request.error);
    });
}
