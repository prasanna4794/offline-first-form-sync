import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "server-db.json");
const EMPTY_DATABASE = { forms: [] };

const hasNeonDatabase = Boolean(process.env.DATABASE_URL);

let neonSqlPromise = null;
let memoryDatabase = structuredClone(EMPTY_DATABASE);
let writeChain = Promise.resolve();
let schemaPromise = null;

async function getNeonSql() {
    if (!hasNeonDatabase) return null;

    if (!neonSqlPromise) {
        neonSqlPromise = import("@neondatabase/serverless").then(({ neon }) =>
            neon(process.env.DATABASE_URL)
        );
    }

    return neonSqlPromise;
}

async function ensureNeonSchema() {
    const sql = await getNeonSql();
    if (!sql) return;

    if (!schemaPromise) {
        schemaPromise = sql`
            CREATE TABLE IF NOT EXISTS offline_forms (
                form_id TEXT PRIMARY KEY,
                transaction_id TEXT,
                status TEXT NOT NULL DEFAULT 'SYNCED',
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                data JSONB NOT NULL DEFAULT '{}'::jsonb
            )
        `;
    }

    await schemaPromise;
}

async function ensureLocalDatabaseFile() {
    await mkdir(DATA_DIR, { recursive: true });

    try {
        await readFile(DATA_FILE, "utf8");
    } catch (error) {
        if (error?.code !== "ENOENT") throw error;
        await writeFile(
            DATA_FILE,
            JSON.stringify(EMPTY_DATABASE, null, 2),
            "utf8"
        );
    }
}

export async function getDatabase() {
    if (hasNeonDatabase) {
        await ensureNeonSchema();
        return { type: "neon" };
    }

    await ensureLocalDatabaseFile();
    const text = await readFile(DATA_FILE, "utf8");

    try {
        return JSON.parse(text);
    } catch {
        await writeFile(
            DATA_FILE,
            JSON.stringify(EMPTY_DATABASE, null, 2),
            "utf8"
        );
        return structuredClone(EMPTY_DATABASE);
    }
}

export async function saveDatabase(database) {
    if (hasNeonDatabase) return;

    await ensureLocalDatabaseFile();

    writeChain = writeChain.then(() =>
        writeFile(
            DATA_FILE,
            JSON.stringify(database, null, 2),
            "utf8"
        )
    );

    return writeChain;
}

export async function getNeonClient() {
    if (!hasNeonDatabase) return null;
    await ensureNeonSchema();
    return getNeonSql();
}

export function isNeonConfigured() {
    return hasNeonDatabase;
}
