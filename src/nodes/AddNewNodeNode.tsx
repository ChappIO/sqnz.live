import {Node, NodeProps} from "./Node";

export interface Props extends NodeProps {

}

export const AddNewNodeNode = ({...nodeProps}: NodeProps) => {
    return (
        <Node {...nodeProps}>
            <i className="fas fa-plus"/>
        </Node>
    )
}