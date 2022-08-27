import {PropsWithChildren, useEffect} from "react";
import {AudioDestinationProvider, useDestination} from "../hooks/useDestination";
import {useAudioContext} from "../hooks/useAudioContext";
import {useSingleton} from "../hooks/useSingleton";

export interface Props {
    volumePercent: number
}

export const Amplifier = ({children, volumePercent}: PropsWithChildren<Props>) => {
    const destination = useDestination();
    const context = useAudioContext();
    const node = useSingleton(() => context.createGain());

    useEffect(() => {
        node.connect(destination);
        return () => node.disconnect();
    }, [node, destination]);

    useEffect(() => {
        node.gain.setTargetAtTime(volumePercent / 100.0, context.currentTime, 0.01)
    }, [node, volumePercent])


    return (
        <AudioDestinationProvider destination={node}>
            {children}
        </AudioDestinationProvider>
    )
}
