import {Node, NodeProps} from "./Node";

export interface Props extends NodeProps {

}

export const SpeakerNode = ({...nodeProps}: NodeProps) => {
    return (
        <Node {...nodeProps}>
            <i className="fas fa-volume-high"/>
        </Node>
    )
}