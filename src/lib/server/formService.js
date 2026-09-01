import { getDatabase, saveDatabase } from "./database";

export async function getForms() {
    const database = await getDatabase();
    return database.forms;
}

export async function createForm(formData) {
    const database = await getDatabase();

    const newForm = {
        id: formData.id,
        formId: formData.formId || formData.id,
        transactionId: formData.transactionId || null,
        status: "synced",
        createdAt: formData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: formData.data || {}
    };

    const index = database.forms.findIndex(
        (form) => form.id === newForm.id
    );

    if (index >= 0) {
        database.forms[index] = {
            ...database.forms[index],
            ...newForm,
            createdAt: database.forms[index].createdAt || newForm.createdAt
        };
    } else {
        database.forms.push(newForm);
    }

    await saveDatabase(database);

    return index >= 0 ? database.forms[index] : newForm;
}

export async function upsertSyncedForm({
    formId,
    transactionId,
    payload
}) {
    const database = await getDatabase();
    const now = new Date().toISOString();

    const index = database.forms.findIndex(
        (form) => form.formId === formId || form.id === formId
    );

    const existing = index >= 0 ? database.forms[index] : null;

    const syncedForm = {
        id: existing?.id || formId,
        formId,
        transactionId,
        status: "synced",
        createdAt: existing?.createdAt || now,
        updatedAt: now,
        data: payload
    };

    if (index >= 0) {
        database.forms[index] = syncedForm;
    } else {
        database.forms.push(syncedForm);
    }

    await saveDatabase(database);

    return syncedForm;
}
