import {PropsWithChildren, useEffect} from "react";
import {useAudioNode} from "../../hooks/useAudioNode";
import {AudioDestinationProvider} from "../../hooks/useDestination";

export interface Props {
    threshold: number;
    knee: number;
    ratio: number;
    attack: number;
    release: number;
}

export const Compressor = ({threshold, knee, ratio, attack, release, children}: PropsWithChildren<Props>) => {
    const [context, compressor, destination] = useAudioNode(context => context.createDynamicsCompressor());

    useEffect(() => {
        compressor.threshold.setValueAtTime(threshold, context.currentTime);
    }, [compressor, context, threshold]);
    useEffect(() => {
        compressor.knee.setValueAtTime(knee, context.currentTime);
    }, [compressor, context, knee]);
    useEffect(() => {
        compressor.ratio.setValueAtTime(ratio, context.currentTime);
    }, [compressor, context, ratio]);
    useEffect(() => {
        compressor.attack.setValueAtTime(attack, context.currentTime);
    }, [compressor, context, attack]);
    useEffect(() => {
        compressor.release.setValueAtTime(release, context.currentTime);
    }, [compressor, context, release]);

    return (
        <AudioDestinationProvider destination={destination}>
            {children}
        </AudioDestinationProvider>
    );
}
