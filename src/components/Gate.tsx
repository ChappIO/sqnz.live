import {PropsWithChildren, useCallback, useRef, useState} from "react";
import {AudioDestinationProvider, useDestination} from "../hooks/useDestination";
import {useAudioContext} from "../hooks/useAudioContext";
import {useTrigger} from "../hooks/useTrigger";

export interface Props {
}

const minGate = 0.01;

export const Gate = ({children}: PropsWithChildren<Props>) => {
    const destination = useDestination();
    const context = useAudioContext();
    const openGate = useRef<number>();
    const [node] = useState(() => {
        const node = context.createGain();
        node.gain.setValueAtTime(0, context.currentTime);
        node.connect(destination);
        return node;
    });

    useTrigger(useCallback(({note}) => {
        node.gain.setTargetAtTime(1, context.currentTime, minGate)
        clearTimeout(openGate.current);
        openGate.current = setTimeout(() => {
            node.gain.setTargetAtTime(0, context.currentTime, minGate)
        }, note.gate) as any;
    }, [node, context]))

    return (
        <AudioDestinationProvider destination={node}>
            {children}
        </AudioDestinationProvider>
    )
}
