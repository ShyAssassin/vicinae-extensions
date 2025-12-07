import path from "path";
import { homedir } from "os";
import { existsSync } from "fs";
import { Preferences } from "./types";
import { getPreferenceValues } from "@vicinae/api";
import { VSCODE_STATE_PATHS, ERROR_MESSAGES } from "./constants";

export function getVSCodeStateDBPath(): string {
    const home = homedir();
    const { vscodeFlavour } = getPreferenceValues<Preferences>();
    const platform = process.platform as keyof typeof VSCODE_STATE_PATHS;

    let dbPath: string;

    if (platform in VSCODE_STATE_PATHS) {
        dbPath = VSCODE_STATE_PATHS[platform](home, vscodeFlavour);
    } else {
        // Default to Linux path for unsupported platforms
        dbPath = VSCODE_STATE_PATHS.linux(home, vscodeFlavour);
    }

    if (!existsSync(dbPath)) {
        throw new Error(ERROR_MESSAGES.DATABASE_NOT_FOUND(vscodeFlavour, dbPath));
    }

    return dbPath;
}

export function isRemoteUri(uri: string): boolean {
    return uri.startsWith("vscode-remote://");
}

export function decodeRemoteUri(uri: string): { path: string; authority: string } {
    // Remote URIs format: vscode-remote://ssh-remote+hostname/path/to/folder
    const match = uri.match(/^vscode-remote:\/\/([^/]+)(\/.*)?$/);
    if (!match) {
        throw new Error(`Invalid remote URI: ${uri}`);
    }
    return {
        authority: match[1],
        path: match[2] || "/",
    };
}

export function decodeFileUri(uri: string): string {
    return decodeURIComponent(uri.replace(/^file:\/\//, ""));
}

export function getProjectLabel(projectPath: string, isWorkspace: boolean, remoteAuthority?: string): string {
    const baseName = isWorkspace ? path.basename(projectPath, ".code-workspace") : path.basename(projectPath);

    if (remoteAuthority) {
        // Extract hostname from ssh-remote+hostname format
        const hostname = remoteAuthority.replace(/^ssh-remote\+/, "");
        return `${baseName} (${hostname})`;
    }

    return baseName;
}

export function sortProjectsByLastOpened<T extends { lastOpened: number }>(projects: T[]): T[] {
    return [...projects].sort((a, b) => b.lastOpened - a.lastOpened);
}
