import {createContext, ReactElement} from "react";
import {NodeProps} from "./Node";

export interface NodeContextData {
    nodes: ReactElement<NodeProps>[];
}

export const NodeContext = createContext<NodeContextData>({
    nodes: []
});

