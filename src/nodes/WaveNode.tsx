import {Node, NodeProps} from "./Node";

export interface Props extends NodeProps {

}

export const WaveNode = ({...nodeProps}: NodeProps) => {
    return (
        <Node {...nodeProps}>
            <i className="fas fa-wave-square"/>
        </Node>
    )
}