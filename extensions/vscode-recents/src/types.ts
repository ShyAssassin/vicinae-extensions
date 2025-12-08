export enum ProjectType {
    File = "file",
    Folder = "folder",
    Workspace = "workspace",
    RemoteSSH = "remote-ssh",
}

export interface RecentProject {
    path: string;
    label: string;
    type: ProjectType;
    lastOpened: number;
    remoteAuthority?: string;
}

export interface VSCodeDatabaseEntry {
    folderUri?: string;
    fileUri?: string;
    workspace?: {
        configPath: string;
    };
    remoteAuthority?: string;
    lastAccessTime?: number;
}

export interface VSCodeRecentData {
    entries: VSCodeDatabaseEntry[];
}

export enum VSCodeFlavour {
    Code = "Code",
    Cursor = "Cursor",
    VSCodium = "VSCodium",
    CodeInsiders = "Code - Insiders",
}

export interface Preferences {
    vscodeFlavour: VSCodeFlavour;
}

export interface DatabaseRow {
    key: string;
    value: string;
}
