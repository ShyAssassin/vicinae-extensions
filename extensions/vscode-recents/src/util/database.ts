import path from "path";
import { readFile } from "fs";
import { promisify } from "util";
import { DatabaseRow } from "../types";
import initSqlJs, { Database } from "sql.js";
import { getVSCodeStateDBPath } from "../helpers";
import { RECENT_PROJECTS_QUERY, SQL_WASM_PATH, ERROR_MESSAGES } from "../constants";

const read = promisify(readFile);

let DATABASE: Database | null = null;

export async function initializeDatabase(): Promise<Database> {
    if (DATABASE) {
        return DATABASE;
    }

    const dbPath = getVSCodeStateDBPath();

    try {
        const bufferRaw = await read(dbPath);
        const SQL = await initSqlJs({
            locateFile: () => path.resolve(__dirname, SQL_WASM_PATH),
        });

        console.log("[DEBUG] Loaded VS Code state database from:", dbPath);
        DATABASE = new SQL.Database(new Uint8Array(bufferRaw));
        return DATABASE;
    } catch (error) {
        throw new Error(`Failed to initialize database: ${(error as Error).message}`);
    }
}

export function getDatabase(): Database {
    if (!DATABASE) {
        throw new Error("Database not initialized. Call initializeDatabase() first.");
    }
    return DATABASE;
}

export function queryRecentProjects(): DatabaseRow[] {
    const db = getDatabase();
    const results: DatabaseRow[] = [];

    try {
        const statement = db.prepare(RECENT_PROJECTS_QUERY);

        while (statement.step()) {
            const row = statement.getAsObject();
            if (row.value) {
                results.push({
                    key: row.key as string,
                    value: row.value as string,
                });
            }
        }

        statement.free();
        return results;
    } catch (error) {
        console.error(ERROR_MESSAGES.DATABASE_QUERY_FAILED, error);
        throw new Error(ERROR_MESSAGES.DATABASE_QUERY_FAILED);
    }
}

export function closeDatabase(): void {
    if (DATABASE) {
        DATABASE.close();
        DATABASE = null;
    }
}
