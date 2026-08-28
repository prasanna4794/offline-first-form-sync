import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "server-db.json");

const EMPTY_DATABASE = {
    forms: []
};

let writeChain = Promise.resolve();

async function ensureDatabaseFile() {
    await mkdir(DATA_DIR, { recursive: true });

    try {
        await readFile(DATA_FILE, "utf8");
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
        await writeFile(
            DATA_FILE,
            JSON.stringify(EMPTY_DATABASE, null, 2),
            "utf8"
        );
    }
}

export async function getDatabase() {
    await ensureDatabaseFile();

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
    await ensureDatabaseFile();

    writeChain = writeChain.then(() =>
        writeFile(
            DATA_FILE,
            JSON.stringify(database, null, 2),
            "utf8"
        )
    );

    return writeChain;
}
