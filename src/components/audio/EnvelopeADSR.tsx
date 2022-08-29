import {useAudioNode} from "../../hooks/useAudioNode";
import {PropsWithChildren, useEffect} from "react";
import {useTrigger} from "../../hooks/useTrigger";
import {AudioDestinationProvider} from "../../hooks/useDestination";

export interface Props {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
}

export const EnvelopeADSR = ({attack, decay, sustain, release, children}: PropsWithChildren<Props>) => {
    const [context, amp, destination] = useAudioNode((context) => context.createGain());
    const trigger = useTrigger();

    useEffect(() => {
        return trigger.unsubscribe(
            trigger.addEventListener('gateOpen', () => {
                amp.gain.linearRampToValueAtTime(1, context.currentTime + attack);
                amp.gain.setTargetAtTime(sustain, context.currentTime + attack, decay);
            }),
            trigger.addEventListener('gateClose', () => {
                amp.gain.setTargetAtTime(0, context.currentTime, release);
            })
        );
    }, [trigger, amp]);

    useEffect(() => {
        amp.gain.setValueAtTime(0, context.currentTime);
    }, [amp, context]);

    return (
        <AudioDestinationProvider destination={destination}>
            {children}
        </AudioDestinationProvider>
    )
}
