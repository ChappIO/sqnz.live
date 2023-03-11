import {Node, NodeProps} from "./Node";
import React from "react";
import {useAudioContext} from "../hooks/useAudioContext";
import {useSingleton} from "../hooks/useSingleton";
import {useRegisterAudioNode} from "../hooks/useAudioNodeRegister";

export interface Props extends NodeProps {

}

export const SpeakerNode = ({...nodeProps}: NodeProps) => {
    const context = useAudioContext();
    const output = useSingleton(() => context.destination);
    useRegisterAudioNode(nodeProps.id, output);
    return (
        <Node {...nodeProps}>
            <i className="fas fa-volume-high"/>
        </Node>
    )
}
