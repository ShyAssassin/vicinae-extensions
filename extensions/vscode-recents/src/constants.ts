export const RECENT_PROJECTS_QUERY = "SELECT key, value FROM ItemTable WHERE key LIKE 'history.recentlyOpenedPathsList'";

export const SQL_WASM_PATH = "assets/sql-wasm.wasm";

export const FILE_URI_SCHEME = "file://";

export const WORKSPACE_EXTENSION = ".code-workspace";

// Note: needs to match Preferences.vscodeFlavour values
export const VSCODE_EXECUTABLES: Record<string, string> = {
    Code: "code",
    Cursor: "cursor",
    VSCodium: "codium",
    "Code - Insiders": "code-insiders",
};

export const VSCODE_STATE_PATHS = {
    darwin: (home: string, flavour: string) => `${home}/Library/Application Support/${flavour}/User/globalStorage/state.vscdb`,
    win32: (home: string, flavour: string) => `${home}/AppData/Roaming/${flavour}/User/globalStorage/state.vscdb`,
    linux: (home: string, flavour: string) => `${home}/.config/${flavour}/User/globalStorage/state.vscdb`,
} as const;

export const ERROR_MESSAGES = {
    PARSE_ERROR: "Error parsing recent projects data",
    DATABASE_QUERY_FAILED: "Failed to query the database",
    INVALID_FLAVOUR: (flavour: string) => `Unknown VSCode flavour: ${flavour}`,
    DATABASE_NOT_FOUND: (flavour: string, path: string) =>
        `Database for ${flavour} not found at: ${path}. Make sure it's installed and that you have opened it at least once.`,
    COMMAND_NOT_FOUND: (executable: string) => `Make sure the '${executable}' command is available in your PATH.`,
} as const;
