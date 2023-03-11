import {Node} from "./Node";
import {ReactNode} from "react";

export class WaveNode extends Node {
    renderNode(): ReactNode {
        return <i className="fas fa-wave-square"/>;
    }
}
