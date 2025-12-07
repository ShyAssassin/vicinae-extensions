import { List, Icon } from "@vicinae/api";
import { ProjectActions } from "./ProjectActions";
import { RecentProject, ProjectType } from "../types";

interface ProjectListItemProps {
    project: RecentProject;
    index: number;
}

function getProjectIcon(type: ProjectType): Icon {
    switch (type) {
        case ProjectType.Workspace:
            return Icon.Document;
        case ProjectType.Folder:
            return Icon.Folder;
        case ProjectType.File:
            return Icon.BlankDocument;
        case ProjectType.RemoteSSH:
            return Icon.Cloud;
        default:
            return Icon.QuestionMark;
    }
}

function getProjectTypeLabel(type: ProjectType): List.Item.Tag {
    switch (type) {
        case ProjectType.Workspace:
            return "Workspace";
        case ProjectType.Folder:
            return "Folder";
        case ProjectType.File:
            return "File";
        case ProjectType.RemoteSSH:
            return "SSH";
        default:
            return "Unknown";
    }
}

export function ProjectListItem({ project, index }: ProjectListItemProps) {
    return (
        <List.Item
            title={project.label}
            subtitle={project.path}
            icon={getProjectIcon(project.type)}
            key={`${project.path}-${index}`}
            accessories={[
                {
                    icon: getProjectIcon(project.type),
                    tag: getProjectTypeLabel(project.type),
                },
            ]}
            actions={<ProjectActions project={project} />}
        />
    );
}
