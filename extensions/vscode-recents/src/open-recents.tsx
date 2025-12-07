import { RecentProject } from "./types";
import { Icon, List } from "@vicinae/api";
import { useEffect, useState } from "react";
import { ErrorView } from "./components/ErrorView";
import { initializeDatabase } from "./util/database";
import { ProjectListItem } from "./components/ProjectListItem";
import { getRecentProjects, filterProjects } from "./util/projects";

export default function Command() {
    const [query, setQuery] = useState("");
    const [error, setError] = useState<Error>();
    const [isLoading, setIsLoading] = useState(true);
    const [projects, setProjects] = useState<RecentProject[]>([]);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                await initializeDatabase();
                const recentProjects = getRecentProjects();
                setProjects(recentProjects);
            } catch (error) {
                setError(error as Error);
                setProjects([]);
            }
            setIsLoading(false);
        })();
    }, []);

    if (error) {
        return <ErrorView error={error} />;
    }

    const filteredProjects = filterProjects(projects, query);

    return (
        <List isLoading={isLoading} onSearchTextChange={setQuery} searchBarPlaceholder="Search recent projects">
            {filteredProjects.map((project, index) => (
                <ProjectListItem index={index} project={project} key={`${project.path}-${index}`} />
            ))}
            <List.EmptyView icon={Icon.Document} title="No Recent Projects Found" description="No recent VSCode projects available." />
        </List>
    );
}
