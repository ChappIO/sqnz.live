import {useSingleton} from "../../hooks/useSingleton";
import {TriggerProvider, TriggerSource} from "../../hooks/useTrigger";
import {PropsWithChildren, useEffect, useState} from "react";
import {Note} from "../../music/Note";
import {useTransport} from "../../hooks/useTransport";

export type Step  = {
    note: Note;
    steps: number;
} | null;

export interface Props {
    steps: Step[];
    onChangeActiveStep: (step: number) => void;
}

export const Sequencer = ({children, steps, onChangeActiveStep}: PropsWithChildren<Props>) => {
    const trigger = useSingleton(() => new TriggerSource());
    const transport = useTransport();

    const [playing, setPlaying] = useState(transport.isPlaying());
    const [step, setStep] = useState(0);

    useEffect(() => {
        return transport.unsubscribe(
            transport.addEventListener('play', () => {
                setStep(0);
                setPlaying(true);
            }),
            transport.addEventListener('stop', () => {
                setPlaying(false);
                setStep(0);
            }),
            transport.addEventListener('pulse', () => {
                setStep(prev => (prev + 1) % (steps.length));
            })
        );
    }, [transport, steps]);

    useEffect(() => {
        if (!playing) {
            return;
        }
        // trigger current step
        const note = steps[step];
        if (note) {
            trigger.fire('noteOn', {
                note: note.note,
                gateLength: transport.getPulseLength() * note.steps
            });
        }
    }, [step, trigger, transport, steps, playing]);

    useEffect(() => {
        onChangeActiveStep(step);
    },[step, onChangeActiveStep]);

    return (
        <TriggerProvider source={trigger}>
            {children}
        </TriggerProvider>
    );
}
