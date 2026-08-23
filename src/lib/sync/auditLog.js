import {
    openDatabase
} from "@/lib/db/indexedDB";


const AUDIT_STORE = "syncAuditLogs";


export async function createAuditLog({

    transactionId,

    formId,

    event,

    status,

    message = null,

    retryCount = 0,

}) {

    const database =
        await openDatabase();


    return new Promise(
        (resolve, reject) => {

            const transaction =
                database.transaction(
                    AUDIT_STORE,
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    AUDIT_STORE
                );


            /*
            |--------------------------------------------------------------------------
            | Use transactionId as the Audit ID
            |--------------------------------------------------------------------------
            |
            | One transaction = One audit record.
            |
            */

            const request =
                store.get(transactionId);


            request.onsuccess = () => {

                const existingLog =
                    request.result;


                const log = {

                    id:
                        transactionId,

                    transactionId,

                    formId,

                    event,

                    status,

                    message,

                    retryCount,

                    timestamp:
                        existingLog?.timestamp ||
                        new Date().toISOString(),

                    updatedAt:
                        new Date().toISOString(),

                };


                /*
                |--------------------------------------------------------------------------
                | put() = Create OR Update
                |--------------------------------------------------------------------------
                */

                const saveRequest =
                    store.put(log);


                saveRequest.onsuccess = () => {

                    resolve(log);

                };


                saveRequest.onerror = () => {

                    reject(
                        saveRequest.error
                    );

                };

            };


            request.onerror = () => {

                reject(
                    request.error
                );

            };

        }
    );

}

export async function getAllAuditLogs() {

    const database =
        await openDatabase();


    return new Promise(

        (resolve, reject) => {

            const transaction =
                database.transaction(

                    AUDIT_STORE,

                    "readonly"

                );


            const store =
                transaction.objectStore(

                    AUDIT_STORE

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

        }

    );

}