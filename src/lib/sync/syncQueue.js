const DB_NAME = "offline-first-form-db";
const DB_VERSION = 2;
const STORE_NAME = "syncQueue";

/*
|--------------------------------------------------------------------------
| Open Sync Queue Database
|--------------------------------------------------------------------------
*/

function openSyncQueueDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            /*
             * Do not remove existing object stores.
             * We only create syncQueue if it does not already exist.
             */

            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, {
                    keyPath: "id",
                });

                store.createIndex("status", "status", {
                    unique: false,
                });

                store.createIndex("priority", "priority", {
                    unique: false,
                });

                store.createIndex("createdAt", "createdAt", {
                    unique: false,
                });

                store.createIndex("formId", "formId", {
                    unique: false,
                });
            }
        };

        request.onsuccess = () => {
            resolve(request.result);
        };

        request.onerror = () => {
            reject(request.error);
        };
    });
}

/*
|--------------------------------------------------------------------------
| Generate Transaction ID
|--------------------------------------------------------------------------
*/

function generateTransactionId() {
    return `sync-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}`;
}

/*
|--------------------------------------------------------------------------
| Add Transaction To Queue
|--------------------------------------------------------------------------
*/

export async function addToSyncQueue({
    formId,
    operation = "UPDATE",
    payload,
    priority = "MEDIUM",
}) {
    const db = await openSyncQueueDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(
            STORE_NAME,
            "readwrite"
        );

        const store = transaction.objectStore(STORE_NAME);

        const queueItem = {
            id: generateTransactionId(),

            formId,

            operation,

            payload,

            priority,

            status: "PENDING",

            retryCount: 0,

            createdAt: new Date().toISOString(),

            updatedAt: new Date().toISOString(),

            lastAttemptAt: null,

            error: null,
        };

        const request = store.add(queueItem);

        request.onsuccess = () => {
            resolve(queueItem);
        };

        request.onerror = () => {
            reject(request.error);
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
}

/*
|--------------------------------------------------------------------------
| Get All Queue Items
|--------------------------------------------------------------------------
*/

export async function getAllSyncQueueItems() {
    const db = await openSyncQueueDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(
            STORE_NAME,
            "readonly"
        );

        const store = transaction.objectStore(STORE_NAME);

        const request = store.getAll();

        request.onsuccess = () => {
            const items = request.result;

            items.sort((a, b) => {
                return (
                    new Date(a.createdAt) -
                    new Date(b.createdAt)
                );
            });

            resolve(items);
        };

        request.onerror = () => {
            reject(request.error);
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
}

/*
|--------------------------------------------------------------------------
| Get Pending Queue Items
|--------------------------------------------------------------------------
*/

export async function getPendingSyncItems() {
    const items = await getAllSyncQueueItems();

    const priorityWeight = {
        HIGH: 1,
        MEDIUM: 2,
        LOW: 3,
    };

    return items
        .filter((item) => item.status === "PENDING")
        .sort((a, b) => {
            const priorityA =
                priorityWeight[a.priority] || 99;

            const priorityB =
                priorityWeight[b.priority] || 99;

            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }

            return (
                new Date(a.createdAt) -
                new Date(b.createdAt)
            );
        });
}

/*
|--------------------------------------------------------------------------
| Update Queue Item
|--------------------------------------------------------------------------
*/

export async function updateSyncQueueItem(
    id,
    updates
) {
    const db = await openSyncQueueDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(
            STORE_NAME,
            "readwrite"
        );

        const store = transaction.objectStore(STORE_NAME);

        const request = store.get(id);

        request.onsuccess = () => {
            const existingItem = request.result;

            if (!existingItem) {
                reject(
                    new Error(
                        `Sync queue item not found: ${id}`
                    )
                );

                return;
            }

            const updatedItem = {
                ...existingItem,

                ...updates,

                updatedAt: new Date().toISOString(),
            };

            store.put(updatedItem);

            resolve(updatedItem);
        };

        request.onerror = () => {
            reject(request.error);
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
}

/*
|--------------------------------------------------------------------------
| Mark Item As Syncing
|--------------------------------------------------------------------------
*/

export async function markSyncing(id) {
    return updateSyncQueueItem(id, {
        status: "SYNCING",
        lastAttemptAt: new Date().toISOString(),
    });
}

/*
|--------------------------------------------------------------------------
| Mark Item As Synced
|--------------------------------------------------------------------------
*/

export async function markSynced(id) {
    return updateSyncQueueItem(id, {
        status: "SYNCED",
        error: null,
    });
}

/*
|--------------------------------------------------------------------------
| Mark Item As Failed
|--------------------------------------------------------------------------
*/

export async function markSyncFailed(
    id,
    errorMessage
) {
    const items = await getAllSyncQueueItems();

    const item = items.find(
        (queueItem) => queueItem.id === id
    );

    const retryCount =
        (item?.retryCount || 0) + 1;

    return updateSyncQueueItem(id, {
        status: "FAILED",

        retryCount,

        error: errorMessage,
    });
}

/*
|--------------------------------------------------------------------------
| Delete Queue Item
|--------------------------------------------------------------------------
*/

export async function deleteSyncQueueItem(id) {
    const db = await openSyncQueueDB();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(
            STORE_NAME,
            "readwrite"
        );

        const store = transaction.objectStore(STORE_NAME);

        const request = store.delete(id);

        request.onsuccess = () => {
            resolve(true);
        };

        request.onerror = () => {
            reject(request.error);
        };

        transaction.oncomplete = () => {
            db.close();
        };
    });
}

/*
|--------------------------------------------------------------------------
| Clear Successfully Synced Items
|--------------------------------------------------------------------------
*/

export async function clearSyncedItems() {
    const items = await getAllSyncQueueItems();

    const syncedItems = items.filter(
        (item) => item.status === "SYNCED"
    );

    for (const item of syncedItems) {
        await deleteSyncQueueItem(item.id);
    }

    return syncedItems.length;
}