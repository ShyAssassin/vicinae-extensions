import { promisify } from "util";
import { exec } from "child_process";
import { Preferences, RecentProject, ProjectType } from "../types";
import { VSCODE_EXECUTABLES, ERROR_MESSAGES } from "../constants";
import { getPreferenceValues, showToast, Toast } from "@vicinae/api";

const execAsync = promisify(exec);

function getVSCodeExecutable(): string {
    const { vscodeFlavour } = getPreferenceValues<Preferences>();
    const executable = VSCODE_EXECUTABLES[vscodeFlavour];

    if (!executable) {
        throw new Error(ERROR_MESSAGES.INVALID_FLAVOUR(vscodeFlavour));
    }

    return executable;
}

async function isExecutableAvailable(executable: string): Promise<boolean> {
    try {
        await execAsync(`command -v ${executable}`);
        return true;
    } catch {
        return false;
    }
}

export async function openProjectInVSCode(project: RecentProject): Promise<void> {
    const { vscodeFlavour } = getPreferenceValues<Preferences>();
    const executable = getVSCodeExecutable();

    try {
        const isAvailable = await isExecutableAvailable(executable);

        if (!isAvailable) {
            showToast({
                title: "Command not found",
                style: Toast.Style.Failure,
                message: ERROR_MESSAGES.COMMAND_NOT_FOUND(executable),
            });
            return;
        }

        let command: string;

        if (project.type === ProjectType.RemoteSSH && project.remoteAuthority) {
            // For remote SSH projects, construct the vscode-remote URI
            const remoteUri = `vscode-remote://${project.remoteAuthority}${project.path}`;
            command = `${executable} --new-window --folder-uri "${remoteUri}"`;
        } else {
            // For local projects, use the path directly
            command = `${executable} --new-window "${project.path}"`;
        }

        await execAsync(command);
    } catch (error) {
        console.error(`Error opening project in ${vscodeFlavour}:`, error);
        showToast({
            style: Toast.Style.Failure,
            title: "Failed to open project",
            message: `Could not open project in ${vscodeFlavour}`,
        });
    }
}
