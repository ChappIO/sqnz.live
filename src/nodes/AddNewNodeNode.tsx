import {CustomNode, Node, NodeProps} from "./Node";

export const AddNewNodeNode: CustomNode = ({...nodeProps}: NodeProps) => {
    return (
        <Node {...nodeProps} node={AddNewNodeNode}>
        </Node>
    )
}

AddNewNodeNode.displayName = "New";
AddNewNodeNode.icon = 'fa-plus';
