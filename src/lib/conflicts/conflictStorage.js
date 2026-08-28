export async function addConflict(conflict) {

    const database =
        await openDatabase();

    return new Promise((resolve, reject) => {

        const transaction =
            database.transaction(
                "conflicts",
                "readwrite"
            );

        const store =
            transaction.objectStore(
                "conflicts"
            );

        const request =
            store.put(conflict);

        request.onsuccess = () => {

            resolve(request.result);

        };

        request.onerror = () => {

            reject(request.error);

        };

    });

}