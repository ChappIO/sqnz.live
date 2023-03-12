import {CustomNode, Node, NodeProps} from "./Node";
import React, {useEffect} from "react";
import {useAudioContext} from "../hooks/useAudioContext";
import {useSingleton} from "../hooks/useSingleton";
import {useRegisterAudioNode} from "../hooks/useAudioNodeRegister";
import {usePersistedState} from "../hooks/usePersistedState";
import {useProject} from "../hooks/useProject";

export const SpeakerNode: CustomNode = ({...nodeProps}: NodeProps) => {
    const context = useAudioContext();
    const output = useSingleton(() => context.destination);
    const gain = useSingleton(
        () => context.createGain(),
        (gain) => {
            gain.connect(output);
        },
        [output]
    );
    useRegisterAudioNode(nodeProps.id, gain);

    const project = useProject();
    const [volume, setVolume] = usePersistedState('volume', 100, {
        namespace: `${project.namespace}/nodes/${nodeProps.id}`
    });

    useEffect(() => {
        gain.gain.setValueAtTime(volume / 100.0, context.currentTime);
    }, [gain, volume, context]);

    return (
        <Node {...nodeProps} node={SpeakerNode}>
            <div className="form-group">
                <label htmlFor="volume"
                       onClick={() => {
                           setVolume(100);
                       }}>
                    Volume
                </label>
                <input className="input-block"
                       type="range"
                       name="volume"
                       id="volume"
                       min="0"
                       max="120"
                       value={volume}
                       onChange={e => {
                           setVolume(parseFloat(e.target.value))
                       }}
                />
                <output id="output" htmlFor="volume">{volume}</output>
            </div>
        </Node>
    )
}

SpeakerNode.displayName = 'Speaker'
SpeakerNode.icon = 'fa-volume-high';
SpeakerNode.inputs = [
    'audio'
];
