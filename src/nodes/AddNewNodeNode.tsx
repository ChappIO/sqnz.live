import {CustomNode, Node, NodeProps} from "./Node";

export interface Props extends NodeProps {

}

export const AddNewNodeNode: CustomNode = ({...nodeProps}: NodeProps) => {
    return (
        <Node {...nodeProps} icon="fa-plus" name="Add">
        </Node>
    )
}

AddNewNodeNode.displayName = "New";
