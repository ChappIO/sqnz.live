import {CustomNode, Node, NodeProps} from "./Node";


export const ThereminNode: CustomNode = ({...nodeProps}: NodeProps) => {

    return (
        <Node {...nodeProps} node={ThereminNode}>

        </Node>
    )
}

ThereminNode.displayName = 'Theremin';
ThereminNode.category = 'Triggers';
ThereminNode.outputs = ['note'];
ThereminNode.icon = 'fa-hand-spock';
