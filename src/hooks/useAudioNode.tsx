import {useAudioContext} from "./useAudioContext";
import {useSingleton} from "./useSingleton";
import {useEffect} from "react";


export const useAudioNode = <T extends AudioNode>(parent: AudioNode, nodeCreator: (context: AudioContext) => T): [T, AudioContext] => {
    const context = useAudioContext();
    const self = useSingleton(() => {
        const node = nodeCreator(context);
        console.debug('created', node);
        return node;
    });

    useEffect(() => {
        console.debug('connect', self, 'to', parent);
        self.connect(parent);
        return () => {
            console.debug('disconnect', self);
            self.disconnect();
        };
    }, [parent, self])

    return [self, context];
}