import {createContext, useContext} from "react";

export interface Project {
    id: string;
    name: string;
    namespace: string;
}

export const ProjectContext = createContext<Project | undefined>(undefined);

export const useProject = () => useContext(ProjectContext)!;
