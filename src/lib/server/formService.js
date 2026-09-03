import {
    getDatabase,
    isUsingNeon,
    saveDatabase,
    upsertNeonForm,
} from "./database";

export async function getForms() {
    const database = await getDatabase();
    return database.forms;
}

export async function createForm(formData) {
    const now = new Date().toISOString();
    const newForm = {
        id: formData.id,
        formId: formData.formId || formData.id,
        transactionId: formData.transactionId || null,
        status: "synced",
        createdAt: formData.createdAt || now,
        updatedAt: now,
        data: formData.data || {},
    };

    if (isUsingNeon()) {
        return upsertNeonForm(newForm);
    }

    const database = await getDatabase();
    const index = database.forms.findIndex((form) => form.id === newForm.id);

    if (index >= 0) {
        database.forms[index] = {
            ...database.forms[index],
            ...newForm,
            createdAt: database.forms[index].createdAt || newForm.createdAt,
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
    payload,
}) {
    const now = new Date().toISOString();

    if (isUsingNeon()) {
        const database = await getDatabase();
        const existing = database.forms.find(
            (form) => form.formId === formId || form.id === formId
        );

        return upsertNeonForm({
            id: existing?.id || formId,
            formId,
            transactionId,
            status: "synced",
            createdAt: existing?.createdAt || now,
            updatedAt: now,
            data: payload,
        });
    }

    const database = await getDatabase();
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
        data: payload,
    };

    if (index >= 0) {
        database.forms[index] = syncedForm;
    } else {
        database.forms.push(syncedForm);
    }

    await saveDatabase(database);
    return syncedForm;
}
