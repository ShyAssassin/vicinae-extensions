import { Action, ActionPanel, Icon, closeMainWindow, showInFileBrowser } from "@vicinae/api";
import { openProjectInVSCode } from "../util/vscode";

interface ProjectActionsProps {
    projectPath: string;
}

export function ProjectActions({ projectPath }: ProjectActionsProps) {
    return (
        <ActionPanel>
            <Action
                icon={Icon.Code}
                title="Open in Editor"
                onAction={async () => {
                    closeMainWindow();
                    await openProjectInVSCode(projectPath);
                }}
                shortcut={{ modifiers: [], key: "enter" }}
            />
            <Action
                icon={Icon.Folder}
                title="Show in File Manager"
                onAction={() => {
                    closeMainWindow();
                    showInFileBrowser(projectPath);
                }}
                shortcut={{ modifiers: ["shift"], key: "enter" }}
            />
            <Action.CopyToClipboard
                title="Copy Path"
                content={projectPath}
                icon={Icon.Clipboard}
                shortcut={{ modifiers: ["ctrl"], key: "c" }}
            />
        </ActionPanel>
    );
}
