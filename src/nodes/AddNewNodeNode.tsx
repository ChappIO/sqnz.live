import {Node, NodeProps} from "./Node";
import {ReactNode} from "react";

export interface Props extends NodeProps {
    onAdd: () => void;
}

export class AddNewNodeNode extends Node<Props> {

    constructor(props: Props) {
        super(props, {});

        this.onTap = this.onTap.bind(this);
    }

    renderNode(): ReactNode {
        return <i className="fas fa-plus"/>;
    }

    onTap() {
        this.props.onAdd();
    }

}