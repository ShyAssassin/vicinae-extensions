import { Action, ActionPanel, Icon, closeMainWindow, showInFileBrowser, showToast, Toast } from "@vicinae/api";
import { openProjectInVSCode } from "../util/vscode";
import { removeRecentProject } from "../util/database";
import { RecentProject, ProjectType } from "../types";

interface ProjectActionsProps {
    project: RecentProject;
    onRemove?: () => void;
}

export function ProjectActions({ project, onRemove }: ProjectActionsProps) {
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
            {onRemove && (
                <Action
                    icon={Icon.Trash}
                    title="Remove from Recents"
                    style={Action.Style.Destructive}
                    onAction={async () => {
                        try {
                            await showToast({
                                style: Toast.Style.Animated,
                                title: "Removing from recents...",
                            });
                            await removeRecentProject(project.path);
                            await showToast({
                                style: Toast.Style.Success,
                                title: "Removed from recents",
                            });
                            onRemove();
                        } catch (error) {
                            await showToast({
                                style: Toast.Style.Failure,
                                message: (error as Error).message,
                                title: "Failed to remove from recents",
                            });
                        }
                    }}
                    shortcut={{ modifiers: ["ctrl"], key: "x" }}
                />
            )}
        </ActionPanel>
    );
}
