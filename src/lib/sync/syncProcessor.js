import {
    getPendingSyncItems,
    markSyncing,
    markSynced,
    markSyncFailed,
} from "@/lib/sync/syncQueue";

import {
    createAuditLog
} from "@/lib/sync/auditLog";
/*
|--------------------------------------------------------------------------
| Retry Configuration
|--------------------------------------------------------------------------
*/

const BASE_DELAY = 1000; // 1 second

const MAX_RETRIES = 5;


/*
|--------------------------------------------------------------------------
| Exponential Backoff Delay
|--------------------------------------------------------------------------
*/

function calculateRetryDelay(retryCount) {

    return (
        BASE_DELAY *
        Math.pow(2, retryCount)
    );
}


/*
|--------------------------------------------------------------------------
| Wait Helper
|--------------------------------------------------------------------------
*/

function wait(milliseconds) {

    return new Promise((resolve) => {

        setTimeout(
            resolve,
            milliseconds
        );

    });
}


/*
|--------------------------------------------------------------------------
| Sync One Transaction
|--------------------------------------------------------------------------
*/

async function syncTransaction(item) {

    try {

        await markSyncing(item.id);

await createAuditLog({

    transactionId:
        item.id,

    formId:
        item.formId,

    event:
        "SYNC_STARTED",

    status:
        "SYNCING",

    retryCount:
        item.retryCount || 0,

});
        /*
        |--------------------------------------------------------------------------
        | Send Request To Server
        |--------------------------------------------------------------------------
        */

        const response = await fetch(
            "/api/sync",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({

                    transactionId:
                        item.id,

                    formId:
                        item.formId,

                    operation:
                        item.operation,

                    payload:
                        item.payload,

                    priority:
                        item.priority,

                }),
            }
        );


        /*
        |--------------------------------------------------------------------------
        | Server Error
        |--------------------------------------------------------------------------
        */

        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        /*
        |--------------------------------------------------------------------------
        | Successful Sync
        |--------------------------------------------------------------------------
        */

        await markSynced(
            item.id
        );


        console.log(
            `Successfully synced: ${item.id}`
        );


        return {
            success: true,
        };

    } catch (error) {

        console.error(
            `Sync failed: ${item.id}`,
            error
        );


        /*
        |--------------------------------------------------------------------------
        | Retry Count
        |--------------------------------------------------------------------------
        */

        const retryCount =
            item.retryCount || 0;


        /*
        |--------------------------------------------------------------------------
        | Maximum Retry Check
        |--------------------------------------------------------------------------
        */

        if (retryCount >= MAX_RETRIES) {

            await markSyncFailed(
                item.id,
                `Maximum retry attempts reached: ${error.message}`
            );


            console.error(
                `Maximum retries reached for ${item.id}`
            );


            return {
                success: false,

                permanentlyFailed: true,
            };
        }


        /*
        |--------------------------------------------------------------------------
        | Calculate Backoff
        |--------------------------------------------------------------------------
        */

        const delay =
            calculateRetryDelay(
                retryCount
            );


        console.log(
            `Retrying ${item.id} in ${delay}ms`
        );


        /*
        |--------------------------------------------------------------------------
        | Wait Before Retry
        |--------------------------------------------------------------------------
        */

        await wait(delay);


        /*
        |--------------------------------------------------------------------------
        | Retry Transaction
        |--------------------------------------------------------------------------
        */

        return syncTransaction({

            ...item,

            retryCount:
                retryCount + 1,

        });

    }
}


/*
|--------------------------------------------------------------------------
| Process Entire Sync Queue
|--------------------------------------------------------------------------
*/

export async function processSyncQueue() {

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


    /*
    |--------------------------------------------------------------------------
    | Process Transactions In Priority Order
    |--------------------------------------------------------------------------
    */

    for (
        const item
        of pendingItems
    ) {

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
}