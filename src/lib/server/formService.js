import { getDatabase } from "./database";

export async function getForms() {

    const database = await getDatabase();

    return database.forms;
}

export async function createForm(formData) {

    const database = await getDatabase();

    const newForm = {
        id: formData.id,
        status: "synced",
        createdAt:
            formData.createdAt ||
            new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: formData.data
    };

    database.forms.push(newForm);

    return newForm;
}