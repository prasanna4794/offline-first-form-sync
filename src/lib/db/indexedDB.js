const DB_NAME = "offline-form-sync";
const DB_VERSION = 1;

const FORM_STORE = "forms";

export function openDatabase() {

    return new Promise((resolve, reject) => {

        const request = indexedDB.open(
            DB_NAME,
            DB_VERSION
        );

        request.onupgradeneeded = (event) => {

            const database = event.target.result;

            if (!database.objectStoreNames.contains(FORM_STORE)) {

                database.createObjectStore(FORM_STORE, {
                    keyPath: "id"
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

export async function saveForm(formData) {

    const database = await openDatabase();

    return new Promise((resolve, reject) => {

        const transaction = database.transaction(
            FORM_STORE,
            "readwrite"
        );

        const store = transaction.objectStore(
            FORM_STORE
        );

        const request = store.put(formData);

        request.onsuccess = () => {

            resolve(formData);

        };

        request.onerror = () => {

            reject(request.error);

        };

    });
}

export async function getForm(formId) {

    const database = await openDatabase();

    return new Promise((resolve, reject) => {

        const transaction = database.transaction(
            FORM_STORE,
            "readonly"
        );

        const store = transaction.objectStore(
            FORM_STORE
        );

        const request = store.get(formId);

        request.onsuccess = () => {

            resolve(request.result);

        };

        request.onerror = () => {

            reject(request.error);

        };

    });
}

export async function getAllForms() {

    const database = await openDatabase();

    return new Promise((resolve, reject) => {

        const transaction = database.transaction(
            FORM_STORE,
            "readonly"
        );

        const store = transaction.objectStore(
            FORM_STORE
        );

        const request = store.getAll();

        request.onsuccess = () => {

            resolve(request.result);

        };

        request.onerror = () => {

            reject(request.error);

        };

    });
}

export async function deleteForm(formId) {

    const database = await openDatabase();

    return new Promise((resolve, reject) => {

        const transaction = database.transaction(
            FORM_STORE,
            "readwrite"
        );

        const store = transaction.objectStore(
            FORM_STORE
        );

        const request = store.delete(formId);

        request.onsuccess = () => {
            resolve(true);
        };

        request.onerror = () => {
            reject(request.error);
        };

    });
}