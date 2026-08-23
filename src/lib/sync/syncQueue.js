const DB_NAME = "offline-form-sync";
const DB_VERSION = 3;

const STORE_NAME = "syncQueue";


/*
|--------------------------------------------------------------------------
| Open Sync Queue Database
|--------------------------------------------------------------------------
*/

export function openSyncQueueDB() {

    return new Promise((resolve, reject) => {

        const request = indexedDB.open(
            DB_NAME,
            DB_VERSION
        );


        request.onupgradeneeded = (event) => {

            const database =
                event.target.result;


            if (
                !database.objectStoreNames.contains(
                    STORE_NAME
                )
            ) {

                database.createObjectStore(
                    STORE_NAME,
                    {
                        keyPath: "id"
                    }
                );

            }

        };


        request.onsuccess = () => {

            resolve(
                request.result
            );

        };


        request.onerror = () => {

            reject(
                request.error
            );

        };

    });

}


/*
|--------------------------------------------------------------------------
| Add Item To Sync Queue
|--------------------------------------------------------------------------
*/

export async function addToSyncQueue({

    id,

    formId,

    operation = "CREATE",

    payload,

    priority = "MEDIUM",

}) {

    const database =
        await openSyncQueueDB();


    return new Promise((resolve, reject) => {

        const transaction =
            database.transaction(
                STORE_NAME,
                "readwrite"
            );


        const store =
            transaction.objectStore(
                STORE_NAME
            );


        const queueItem = {

            id,

            formId,

            operation,

            payload,

            priority,

            status: "PENDING",

            retryCount: 0,

            createdAt:
                new Date().toISOString(),

            updatedAt:
                new Date().toISOString(),

        };


        /*
        |--------------------------------------------------------------------------
        | put() prevents duplicate queue IDs
        |--------------------------------------------------------------------------
        */

        const request =
            store.put(queueItem);


        request.onsuccess = () => {

            resolve(
                queueItem
            );

        };


        request.onerror = () => {

            reject(
                request.error
            );

        };
request.onsuccess = () => {

    if (typeof window !== "undefined") {

        window.dispatchEvent(
            new Event(
                "dashboard-stats-updated"
            )
        );

    }

    resolve(queueItem);

};
    });

}


/*
|--------------------------------------------------------------------------
| Get Pending Sync Items
|--------------------------------------------------------------------------
*/

export async function getPendingSyncItems() {

    const database =
        await openSyncQueueDB();


    return new Promise((resolve, reject) => {

        const transaction =
            database.transaction(
                STORE_NAME,
                "readonly"
            );


        const store =
            transaction.objectStore(
                STORE_NAME
            );


        const request =
            store.getAll();


        request.onsuccess = () => {

            const items =
                request.result.filter(
                    (item) =>
                        item.status === "PENDING"
                );


            resolve(items);

        };


        request.onerror = () => {

            reject(
                request.error
            );

        };

    });

}


/*
|--------------------------------------------------------------------------
| Mark Syncing
|--------------------------------------------------------------------------
*/

export async function markSyncing(
    id
) {

    return updateSyncStatus(
        id,
        "SYNCING"
    );

}


/*
|--------------------------------------------------------------------------
| Mark Synced
|--------------------------------------------------------------------------
*/

export async function markSynced(
    id
) {

    return updateSyncStatus(
        id,
        "SYNCED"
    );

}


/*
|--------------------------------------------------------------------------
| Mark Sync Failed
|--------------------------------------------------------------------------
*/

export async function markSyncFailed(
    id,
    errorMessage
) {

    const database =
        await openSyncQueueDB();


    return new Promise((resolve, reject) => {

        const transaction =
            database.transaction(
                STORE_NAME,
                "readwrite"
            );


        const store =
            transaction.objectStore(
                STORE_NAME
            );


        const request =
            store.get(id);


        request.onsuccess = () => {

            const item =
                request.result;


            if (!item) {

                resolve(null);

                return;

            }


            item.status =
                "FAILED";


            item.error =
                errorMessage;


            item.updatedAt =
                new Date().toISOString();


            const updateRequest =
                store.put(item);


           updateRequest.onsuccess = () => {

    if (typeof window !== "undefined") {

        window.dispatchEvent(
            new Event(
                "dashboard-stats-updated"
            )
        );

    }

    resolve(item);

};


            updateRequest.onerror = () => {

                reject(
                    updateRequest.error
                );

            };

        };


        request.onerror = () => {

            reject(
                request.error
            );

        };

    });

}


/*
|--------------------------------------------------------------------------
| Update Sync Status
|--------------------------------------------------------------------------
*/

async function updateSyncStatus(
    id,
    status
) {

    const database =
        await openSyncQueueDB();


    return new Promise((resolve, reject) => {

        const transaction =
            database.transaction(
                STORE_NAME,
                "readwrite"
            );


        const store =
            transaction.objectStore(
                STORE_NAME
            );


        const request =
            store.get(id);


        request.onsuccess = () => {

            const item =
                request.result;


            if (!item) {

                resolve(null);

                return;

            }


            item.status =
                status;


            item.updatedAt =
                new Date().toISOString();


            const updateRequest =
                store.put(item);


            updateRequest.onsuccess = () => {

                resolve(item);

            };


            updateRequest.onerror = () => {

                reject(
                    updateRequest.error
                );

            };

        };


        request.onerror = () => {

            reject(
                request.error
            );

        };

    });

}


/*
|--------------------------------------------------------------------------
| Get All Sync Items
|--------------------------------------------------------------------------
*/

export async function getAllSyncItems() {

    const database =
        await openSyncQueueDB();


    return new Promise((resolve, reject) => {

        const transaction =
            database.transaction(
                STORE_NAME,
                "readonly"
            );


        const store =
            transaction.objectStore(
                STORE_NAME
            );


        const request =
            store.getAll();


        request.onsuccess = () => {

            resolve(
                request.result
            );

        };


        request.onerror = () => {

            reject(
                request.error
            );

        };

    });

}


/*
|--------------------------------------------------------------------------
| Delete Sync Item
|--------------------------------------------------------------------------
*/

export async function deleteSyncItem(
    id
) {

    const database =
        await openSyncQueueDB();


    return new Promise((resolve, reject) => {

        const transaction =
            database.transaction(
                STORE_NAME,
                "readwrite"
            );


        const store =
            transaction.objectStore(
                STORE_NAME
            );


        const request =
            store.delete(id);


        request.onsuccess = () => {

            resolve(true);

        };


        request.onerror = () => {

            reject(
                request.error
            );

        };

    });

}

export async function retrySyncItem(id) {

    const database =
        await openSyncQueueDB();


    return new Promise((resolve, reject) => {

        const transaction =
            database.transaction(
                STORE_NAME,
                "readwrite"
            );


        const store =
            transaction.objectStore(
                STORE_NAME
            );


        const request =
            store.get(id);


        request.onsuccess = () => {

            const item =
                request.result;


            if (!item) {

                resolve(null);

                return;

            }


            item.status =
                "PENDING";


            item.retryCount =
                0;


            item.error =
                null;


            item.updatedAt =
                new Date().toISOString();


            const updateRequest =
                store.put(item);


            updateRequest.onsuccess = () => {

                resolve(item);

            };


            updateRequest.onerror = () => {

                reject(
                    updateRequest.error
                );

            };

        };


        request.onerror = () => {

            reject(
                request.error
            );

        };

    });

}