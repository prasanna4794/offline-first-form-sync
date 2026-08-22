import {
    openDatabase
} from "@/lib/db/indexedDB";


const AUDIT_STORE =
    "syncAuditLogs";


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


            const log = {

                id:
                    `${transactionId}-${Date.now()}`,

                transactionId,

                formId,

                event,

                status,

                message,

                retryCount,

                timestamp:
                    new Date().toISOString(),

            };


            const request =
                store.add(log);


            request.onsuccess = () => {

                resolve(log);

            };


            request.onerror = () => {

                reject(
                    request.error
                );

            };

        }
    );

}