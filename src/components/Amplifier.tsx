import {PropsWithChildren, useEffect, useState} from "react";
import {AudioDestinationProvider, useDestination} from "../hooks/useDestination";
import {useAudioContext} from "../hooks/useAudioContext";
import {VolumeKnob} from "./VolumeKnob";

export interface Props {
    max: number
    label: string;
    defaultValue?: number;
}

export const Amplifier = ({children, max, label, defaultValue}: PropsWithChildren<Props>) => {
    const destination = useDestination();
    const context = useAudioContext();
    const [node] = useState(() => {
        const node = context.createGain();
        node.connect(destination);
        return node;
    });
    const [volume, setVolume] = useState(() => (defaultValue === undefined ? 100 : defaultValue));

    useEffect(() => {
        node.gain.setTargetAtTime(volume / 100.0, context.currentTime, 0.01)
    }, [context, volume, node]);

    return (
        <AudioDestinationProvider destination={node}>
            {children}
            <VolumeKnob defaultValue={defaultValue} max={max} value={volume} label={label} onChange={setVolume}/>
        </AudioDestinationProvider>
    )
}
