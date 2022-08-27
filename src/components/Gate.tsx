import {PropsWithChildren, useCallback, useEffect, useState} from "react";
import {AudioDestinationProvider, useDestination} from "../hooks/useDestination";
import {useAudioContext} from "../hooks/useAudioContext";
import {useTrigger} from "../hooks/useTrigger";

export interface Props {
    time: number
}

export const Gate = ({children, time}: PropsWithChildren<Props>) => {
    const destination = useDestination();
    const context = useAudioContext();
    const [node] = useState(() => {
        const node = context.createGain();
        node.gain.setValueAtTime(0, context.currentTime);
        node.connect(destination);
        return node;
    });

    useTrigger(useCallback(() => {
        node.gain.setTargetAtTime(1, context.currentTime, 0.01)
        node.gain.setTargetAtTime(0, context.currentTime + (time / 1000), 0.01)
    }, [node, context, time]))

    return (
        <AudioDestinationProvider destination={node}>
            {children}
        </AudioDestinationProvider>
    )
}
