const DB_NAME = "offline-sync-db";

const DB_VERSION = 2;

export const SYNC_QUEUE_STORE = "syncQueue";

export const AUDIT_STORE = "syncAuditLogs";


export function openSyncDB() {

    return new Promise((resolve, reject) => {

        const request = indexedDB.open(
            DB_NAME,
            DB_VERSION
        );


        request.onupgradeneeded = (event) => {

            const db = event.target.result;


            /*
            |--------------------------------------------------------------------------
            | Sync Queue Store
            |--------------------------------------------------------------------------
            */

            if (
                !db.objectStoreNames.contains(
                    SYNC_QUEUE_STORE
                )
            ) {

                db.createObjectStore(
                    SYNC_QUEUE_STORE,
                    {
                        keyPath: "id",
                    }
                );

            }


            /*
            |--------------------------------------------------------------------------
            | Audit Log Store
            |--------------------------------------------------------------------------
            */

            if (
                !db.objectStoreNames.contains(
                    AUDIT_STORE
                )
            ) {

                db.createObjectStore(
                    AUDIT_STORE,
                    {
                        keyPath: "id",
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