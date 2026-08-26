import {
    getPendingSyncItems,
    markSyncing,
    markSynced,
    markSyncFailed,
} from "@/lib/sync/syncQueue";
import {
    updateFormSyncStatus
} from "@/lib/db/indexedDB";
import {
    createAuditLog
} from "@/lib/sync/auditLog";

let isSyncing = false;

const BASE_DELAY = 1000; // 1 second

const MAX_RETRIES = 5;


function calculateRetryDelay(retryCount) {

    return (
        BASE_DELAY *
        Math.pow(2, retryCount)
    );
}


function wait(milliseconds) {

    return new Promise((resolve) => {

        setTimeout(
            resolve,
            milliseconds
        );

    });
}


async function syncTransaction(item) {

    try {


        await markSyncing(
            item.id
        );


        await updateFormSyncStatus(
            item.formId,
            "SYNCING"
        );


        await createAuditLog({

            transactionId:
                item.id,

            formId:
                item.formId,

            event:
                "SYNC_STARTED",

            status:
                "SYNCING"

        });


        const response =
            await fetch(
                "/api/sync",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            transactionId:
                                item.id,

                            formId:
                                item.formId,

                            operation:
                                item.operation,

                            payload:
                                item.payload,

                            priority:
                                item.priority

                        })

                }
            );


        if (!response.ok) {

            throw new Error(

                `Server returned ${response.status}`

            );

        }

        await markSynced(
            item.id
        );


        await updateFormSyncStatus(
            item.formId,
            "SYNCED"
        );


        await createAuditLog({

            transactionId:
                item.id,

            formId:
                item.formId,

            event:
                "SYNC_COMPLETED",

            status:
                "SYNCED"

        });


        return {

            success:
                true

        };

    } catch (error) {

        console.error(

            `Sync failed: ${item.id}`,

            error

        );


        return {

            success:
                false

        };

    }

}


export async function processSyncQueue() {

    if (isSyncing) {

        console.log(
            "Sync already running. Skipping duplicate call."
        );

        return {

            success: true,

            synced: 0,

            reason: "already-syncing",

        };

    }
    if (!navigator.onLine) {

        console.log(
            "Offline - sync skipped."
        );

        return {

            success: false,

            synced: 0,

            reason: "offline",

        };

    }

    isSyncing = true;


    try {

        const pendingItems =
            await getPendingSyncItems();


        const priorityOrder = {

            HIGH: 1,

            MEDIUM: 2,

            LOW: 3,

        };


        pendingItems.sort((a, b) => {

            const priorityA =
                priorityOrder[a.priority] || 2;

            const priorityB =
                priorityOrder[b.priority] || 2;


            return priorityA - priorityB;

        });


        if (pendingItems.length === 0) {

            console.log(
                "No pending sync items."
            );

            return {

                success: true,

                synced: 0,

            };

        }


        let syncedCount = 0;



        for (
            const item
            of pendingItems
        ) {


            if (!navigator.onLine) {

                console.log(
                    "Internet disconnected during sync."
                );

                break;

            }


            const result =
                await syncTransaction(
                    item
                );


            if (result.success) {

                syncedCount++;

            }

        }


        console.log(
            `Sync completed. ${syncedCount} item(s) synced.`
        );


        return {

            success: true,

            synced: syncedCount,

            total:
                pendingItems.length,

        };

    } finally {

    

        isSyncing = false;

    }

}

