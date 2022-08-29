import {useAudioContext} from "./useAudioContext";
import {useSingleton} from "./useSingleton";
import {useDestination} from "./useDestination";
import {useEffect} from "react";


export const useAudioNode = <T extends AudioNode>(nodeCreator: (context: AudioContext) => T, bypass?: boolean): [AudioContext, T, AudioNode] => {
    const context = useAudioContext();
    const parentNode = useDestination();
    const self = useSingleton(() => {
        const node = nodeCreator(context);
        console.log('created', node);
        return node;
    });

    const destination = bypass ? parentNode : self;

    useEffect(() => {
        console.debug('connect', self, 'to', parentNode);
        self.connect(parentNode);
        console.log('done');
        return () => {
            console.debug('disconnect', self);
            self.disconnect();
        };
    }, [parentNode, self])

    return [context, self, destination];
}
