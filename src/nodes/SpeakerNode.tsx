import {Node} from "./Node";
import {ReactNode} from "react";

export class SpeakerNode extends Node {
    renderNode(): ReactNode {
        return <i className="fas fa-volume-high"/>;
    }

}