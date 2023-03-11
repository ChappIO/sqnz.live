import {Node} from "./Node";
import {ReactNode} from "react";

export class AddNewNodeNode extends Node {
    renderNode(): ReactNode {
        return <i className="fas fa-plus"/>;
    }

}