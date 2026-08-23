const DB_NAME = "offline-form-sync";

const DB_VERSION = 3;

const FORM_STORE = "forms";
const AUDIT_STORE = "syncAuditLogs";
const SYNC_QUEUE_STORE = "syncQueue";


export function openDatabase() {

    return new Promise((resolve, reject) => {

        const request = indexedDB.open(
            DB_NAME,
            DB_VERSION
        );


        request.onupgradeneeded = (event) => {

            const database =
                event.target.result;


            /*
            |--------------------------------------------------------------------------
            | Forms
            |--------------------------------------------------------------------------
            */

            if (
                !database.objectStoreNames.contains(
                    FORM_STORE
                )
            ) {

                database.createObjectStore(
                    FORM_STORE,
                    {
                        keyPath: "id"
                    }
                );

            }


            /*
            |--------------------------------------------------------------------------
            | Sync Queue
            |--------------------------------------------------------------------------
            */

            if (
                !database.objectStoreNames.contains(
                    SYNC_QUEUE_STORE
                )
            ) {

                database.createObjectStore(
                    SYNC_QUEUE_STORE,
                    {
                        keyPath: "id"
                    }
                );

            }


            /*
            |--------------------------------------------------------------------------
            | Sync Audit Logs
            |--------------------------------------------------------------------------
            */

            if (
                !database.objectStoreNames.contains(
                    AUDIT_STORE
                )
            ) {

                database.createObjectStore(
                    AUDIT_STORE,
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
| Save Form
|--------------------------------------------------------------------------
*/

export async function saveForm(formData) {

    const database =
        await openDatabase();


    return new Promise((resolve, reject) => {

        const transaction =
            database.transaction(
                FORM_STORE,
                "readwrite"
            );


        const store =
            transaction.objectStore(
                FORM_STORE
            );


        const request =
            store.put(formData);


        request.onsuccess = () => {

            resolve(formData);

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
| Get Form
|--------------------------------------------------------------------------
*/

export async function getForm(formId) {

    const database =
        await openDatabase();


    return new Promise((resolve, reject) => {

        const transaction =
            database.transaction(
                FORM_STORE,
                "readonly"
            );


        const store =
            transaction.objectStore(
                FORM_STORE
            );


        const request =
            store.get(formId);


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
| Get All Forms
|--------------------------------------------------------------------------
*/

export async function getAllForms() {

    const database =
        await openDatabase();


    return new Promise((resolve, reject) => {

        const transaction =
            database.transaction(
                FORM_STORE,
                "readonly"
            );


        const store =
            transaction.objectStore(
                FORM_STORE
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
| Delete Form
|--------------------------------------------------------------------------
*/

export async function deleteForm(formId) {

    const database =
        await openDatabase();


    return new Promise((resolve, reject) => {

        const transaction =
            database.transaction(
                FORM_STORE,
                "readwrite"
            );


        const store =
            transaction.objectStore(
                FORM_STORE
            );


        const request =
            store.delete(formId);


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


/*
|--------------------------------------------------------------------------
| Update Form Sync Status
|--------------------------------------------------------------------------
*/

export async function updateFormSyncStatus(
    formId,
    status
) {

    const database =
        await openDatabase();


    return new Promise((resolve, reject) => {

        const transaction =
            database.transaction(
                FORM_STORE,
                "readwrite"
            );


        const store =
            transaction.objectStore(
                FORM_STORE
            );


        const request =
            store.get(formId);


        request.onsuccess = () => {

            const form =
                request.result;


            if (!form) {

                resolve(null);

                return;

            }


            form.status =
                status;


            form.updatedAt =
                new Date().toISOString();


            const updateRequest =
                store.put(form);


            updateRequest.onsuccess = () => {

                resolve(form);

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