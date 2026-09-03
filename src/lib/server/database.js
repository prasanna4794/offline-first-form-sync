import { neon } from "@neondatabase/serverless";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DATABASE_URL = process.env.DATABASE_URL;
const useNeon = Boolean(DATABASE_URL);

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "server-db.json");
const EMPTY_DATABASE = { forms: [] };

const sql = useNeon ? neon(DATABASE_URL) : null;
let schemaReady;
let writeChain = Promise.resolve();

async function ensureNeonSchema() {
    if (!sql) return;

    if (!schemaReady) {
        schemaReady = sql`
            CREATE TABLE IF NOT EXISTS forms (
                id TEXT PRIMARY KEY,
                form_id TEXT NOT NULL,
                transaction_id TEXT,
                status TEXT NOT NULL DEFAULT 'synced',
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                data JSONB NOT NULL DEFAULT '{}'::jsonb
            )
        `.catch((error) => {
            schemaReady = null;
            throw error;
        });
    }

    await schemaReady;
}

async function ensureLocalDatabaseFile() {
    await mkdir(DATA_DIR, { recursive: true });

    try {
        await readFile(DATA_FILE, "utf8");
    } catch (error) {
        if (error?.code !== "ENOENT") throw error;
        await writeFile(DATA_FILE, JSON.stringify(EMPTY_DATABASE, null, 2), "utf8");
    }
}

export function isUsingNeon() {
    return useNeon;
}

export async function getDatabase() {
    if (useNeon) {
        await ensureNeonSchema();
        const rows = await sql`
            SELECT
                id,
                form_id AS "formId",
                transaction_id AS "transactionId",
                status,
                created_at AS "createdAt",
                updated_at AS "updatedAt",
                data
            FROM forms
            ORDER BY updated_at DESC
        `;

        return { forms: rows };
    }

    await ensureLocalDatabaseFile();
    const text = await readFile(DATA_FILE, "utf8");

    try {
        return JSON.parse(text);
    } catch {
        await writeFile(DATA_FILE, JSON.stringify(EMPTY_DATABASE, null, 2), "utf8");
        return structuredClone(EMPTY_DATABASE);
    }
}

export async function saveDatabase(database) {
    if (useNeon) {
        throw new Error("saveDatabase is not used with Neon storage.");
    }

    await ensureLocalDatabaseFile();

    writeChain = writeChain.then(() =>
        writeFile(DATA_FILE, JSON.stringify(database, null, 2), "utf8")
    );

    return writeChain;
}

export async function upsertNeonForm({
    id,
    formId,
    transactionId,
    status = "synced",
    createdAt,
    updatedAt,
    data = {}
}) {
    if (!useNeon) {
        throw new Error("Neon storage is not configured.");
    }

    await ensureNeonSchema();

    const rows = await sql`
        INSERT INTO forms (
            id,
            form_id,
            transaction_id,
            status,
            created_at,
            updated_at,
            data
        )
        VALUES (
            ${id},
            ${formId},
            ${transactionId},
            ${status},
            ${createdAt ? new Date(createdAt) : new Date()},
            ${updatedAt ? new Date(updatedAt) : new Date()},
            ${JSON.stringify(data)}::jsonb
        )
        ON CONFLICT (id) DO UPDATE SET
            form_id = EXCLUDED.form_id,
            transaction_id = EXCLUDED.transaction_id,
            status = EXCLUDED.status,
            updated_at = EXCLUDED.updated_at,
            data = EXCLUDED.data
        RETURNING
            id,
            form_id AS "formId",
            transaction_id AS "transactionId",
            status,
            created_at AS "createdAt",
            updated_at AS "updatedAt",
            data
    `;

    return rows[0];
}
