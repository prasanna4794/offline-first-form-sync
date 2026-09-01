import {
    getDatabase,
    saveDatabase,
    getNeonClient,
    isNeonConfigured,
} from "./database";

function normalizeServerForm(row) {
    return {
        id: row.form_id ?? row.id,
        formId: row.form_id ?? row.formId,
        transactionId: row.transaction_id ?? row.transactionId ?? null,
        status: row.status ?? "SYNCED",
        createdAt:
            row.created_at?.toISOString?.() ??
            row.createdAt ??
            new Date().toISOString(),
        updatedAt:
            row.updated_at?.toISOString?.() ??
            row.updatedAt ??
            new Date().toISOString(),
        data: row.data ?? {},
    };
}

export async function getForms() {
    if (isNeonConfigured()) {
        const sql = await getNeonClient();
        const rows = await sql`
            SELECT form_id, transaction_id, status, created_at, updated_at, data
            FROM offline_forms
            ORDER BY updated_at DESC
        `;
        return rows.map(normalizeServerForm);
    }

    const database = await getDatabase();
    return database.forms;
}

export async function createForm(formData) {
    if (isNeonConfigured()) {
        const sql = await getNeonClient();
        const formId = formData.formId || formData.id;
        const now = new Date().toISOString();

        const rows = await sql`
            INSERT INTO offline_forms
                (form_id, transaction_id, status, created_at, updated_at, data)
            VALUES
                (${formId}, ${formData.transactionId || null}, 'SYNCED',
                 ${formData.createdAt || now}, ${now}, ${JSON.stringify(formData.data || {})}::jsonb)
            ON CONFLICT (form_id) DO UPDATE SET
                transaction_id = EXCLUDED.transaction_id,
                status = 'SYNCED',
                updated_at = EXCLUDED.updated_at,
                data = EXCLUDED.data
            RETURNING form_id, transaction_id, status, created_at, updated_at, data
        `;

        return normalizeServerForm(rows[0]);
    }

    const database = await getDatabase();
    const now = new Date().toISOString();
    const newForm = {
        id: formData.id,
        formId: formData.formId || formData.id,
        transactionId: formData.transactionId || null,
        status: "SYNCED",
        createdAt: formData.createdAt || now,
        updatedAt: now,
        data: formData.data || {},
    };

    const index = database.forms.findIndex(
        (form) => form.id === newForm.id || form.formId === newForm.formId
    );

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
    if (isNeonConfigured()) {
        const sql = await getNeonClient();
        const now = new Date().toISOString();
        const data = payload?.data ?? payload ?? {};
        const createdAt = payload?.createdAt || now;

        const rows = await sql`
            INSERT INTO offline_forms
                (form_id, transaction_id, status, created_at, updated_at, data)
            VALUES
                (${formId}, ${transactionId}, 'SYNCED',
                 ${createdAt}, ${now}, ${JSON.stringify(data)}::jsonb)
            ON CONFLICT (form_id) DO UPDATE SET
                transaction_id = EXCLUDED.transaction_id,
                status = 'SYNCED',
                updated_at = EXCLUDED.updated_at,
                data = EXCLUDED.data
            RETURNING form_id, transaction_id, status, created_at, updated_at, data
        `;

        return normalizeServerForm(rows[0]);
    }

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
        status: "SYNCED",
        createdAt: existing?.createdAt || payload?.createdAt || now,
        updatedAt: now,
        data: payload?.data ?? payload ?? {},
    };

    if (index >= 0) {
        database.forms[index] = syncedForm;
    } else {
        database.forms.push(syncedForm);
    }

    await saveDatabase(database);
    return syncedForm;
}
