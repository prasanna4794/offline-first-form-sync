import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Local development can persist to data/server-db.json.
// Vercel's deployment filesystem is read-only, so use an in-memory store there.
const IS_VERCEL = process.env.VERCEL === "1";
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "server-db.json");
const EMPTY_DATABASE = { forms: [] };

let memoryDatabase = structuredClone(EMPTY_DATABASE);
let writeChain = Promise.resolve();

async function ensureDatabaseFile() {
    if (IS_VERCEL) return;

    await mkdir(DATA_DIR, { recursive: true });
    try {
        await readFile(DATA_FILE, "utf8");
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
        await writeFile(DATA_FILE, JSON.stringify(EMPTY_DATABASE, null, 2), "utf8");
    }
}

export async function getDatabase() {
    if (IS_VERCEL) return structuredClone(memoryDatabase);

    await ensureDatabaseFile();
    const text = await readFile(DATA_FILE, "utf8");

    try {
        return JSON.parse(text);
    } catch {
        await writeFile(DATA_FILE, JSON.stringify(EMPTY_DATABASE, null, 2), "utf8");
        return structuredClone(EMPTY_DATABASE);
    }
}

export async function saveDatabase(database) {
    if (IS_VERCEL) {
        memoryDatabase = structuredClone(database);
        return;
    }

    await ensureDatabaseFile();
    writeChain = writeChain.then(() =>
        writeFile(DATA_FILE, JSON.stringify(database, null, 2), "utf8")
    );
    return writeChain;
}
