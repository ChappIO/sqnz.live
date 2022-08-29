import {useAudioNode} from "../../hooks/useAudioNode";
import {PropsWithChildren, useEffect} from "react";
import {AudioDestinationProvider} from "../../hooks/useDestination";

export interface Props {
    volume: number;
}

export const Amplifier = ({volume, children}: PropsWithChildren<Props>) => {
    const [context, amp, destination] = useAudioNode((context) => context.createGain());

    useEffect(() => {
        amp.gain.setTargetAtTime(volume / 100, context.currentTime, 0.01);
    }, [amp, context, volume]);

    return (
        <AudioDestinationProvider destination={destination}>
            {children}
        </AudioDestinationProvider>
    )
}
