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