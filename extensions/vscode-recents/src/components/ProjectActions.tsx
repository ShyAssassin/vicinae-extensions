import { Action, ActionPanel, Icon, closeMainWindow, showInFileBrowser } from "@vicinae/api";
import { openProjectInVSCode } from "../util/vscode";
import { RecentProject, ProjectType } from "../types";

interface ProjectActionsProps {
    project: RecentProject;
}

export function ProjectActions({ project }: ProjectActionsProps) {
    const isRemote = project.type === ProjectType.RemoteSSH;

    return (
        <ActionPanel>
            <Action
                icon={Icon.Code}
                title="Open in Editor"
                onAction={async () => {
                    closeMainWindow();
                    await openProjectInVSCode(project);
                }}
                shortcut={{ modifiers: [], key: "enter" }}
            />
            {!isRemote && (
                <Action
                    icon={Icon.Folder}
                    title="Show in File Manager"
                    onAction={() => {
                        closeMainWindow();
                        showInFileBrowser(project.path);
                    }}
                    shortcut={{ modifiers: ["shift"], key: "enter" }}
                />
            )}
            <Action.CopyToClipboard
                title="Copy Path"
                content={project.path}
                icon={Icon.Clipboard}
                shortcut={{ modifiers: ["ctrl"], key: "c" }}
            />
        </ActionPanel>
    );
}
