import {createContext, PropsWithChildren, useCallback, useContext, useEffect, useState} from "react";
import {Track} from "./useTrack";

export interface ProjectSummary {
    name: string;
    folder: FileSystemDirectoryHandle;
}

export interface Project {
    name: string;
    projectDirectory: FileSystemDirectoryHandle;
    tracks: Track[];
}

const Context = createContext<Project | undefined>(undefined);

const getProjectsDir = navigator.storage.getDirectory().then(root => root.getDirectoryHandle('projects', {
    create: true,
}));

const save = async (project: Project) => {
    const file = await project.projectDirectory.getFileHandle('sqnz.project', {
        create: true
    });
    const writer = await file.createWritable({
        keepExistingData: false
    });
    await writer.write(JSON.stringify(project));
    await writer.close();
    console.debug(`Saved project ${project.name} to ${project.projectDirectory.name}`);
}
export const useProject = (): Project => {
    const project = useContext(Context);
    if (!project) {
        throw new Error('useProject must be called from within ProjectProvider');
    }
    return project;
}

async function load(projectSummary: ProjectSummary): Promise<Project> {
    const projectFileHandle = await projectSummary.folder.getFileHandle('sqnz.project');
    const projectFile = await projectFileHandle.getFile();
    const project = JSON.parse(await projectFile.text()) as Project;
    project.projectDirectory = projectSummary.folder;
    if (!project.tracks) {
        project.tracks = [];
    }
    if (project.tracks.length === 0) {
        project.tracks.push({});
    }
    return project;
}

export const ProjectProvider = ({children}: PropsWithChildren) => {
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [project, setProject] = useState<Project>();

    const reloadProjects = useCallback(async () => {
        const projects: ProjectSummary[] = [];

        const projectsDir = await getProjectsDir;
        for await (const entry of projectsDir.values()) {
            if (entry.kind === 'directory') {
                try {
                    const projectFileHandle = await entry.getFileHandle('sqnz.project', {
                        create: false
                    });
                    const projectFile = await projectFileHandle.getFile();
                    const project = JSON.parse(await projectFile.text());
                    if (project.name) {
                        projects.push({
                            name: project.name,
                            folder: entry
                        })
                    }
                } catch (e) {
                    console.warn('Failed to load project: ' + e);
                }
            }
        }
        setProjects(projects);
    }, []);

    const createProject = useCallback(async () => {
        const projectsDir = await getProjectsDir;
        const projectDir = await projectsDir.getDirectoryHandle('project_' + Date.now(), {
            create: true
        });
        const project = {
            name: 'New Project',
            projectDirectory: projectDir,
        } as Project;
        await save(project);
        await reloadProjects();
    }, [reloadProjects]);

    useEffect(() => {
        reloadProjects().then(() => {
        });
    }, [reloadProjects]);

    if (project) {
        return <Context.Provider value={project}>{children}</Context.Provider>
    }

    return (
        <>
            <h1>SQNZ.<sup>live</sup></h1>
            <button onClick={() => {
                createProject();
            }}>Create New Song
            </button>
            {projects.map(project => (
                <div key={project.folder.name}>
                    <button onClick={async () => {
                        setProject(await load(project));
                    }}>
                        {project.name}
                    </button>
                </div>
            ))}
            {projects.length === 0 && (
                <div>No projects...</div>
            )}
        </>
    );
}
