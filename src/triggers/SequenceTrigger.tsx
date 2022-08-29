import {useSingleton} from "../hooks/useSingleton";
import {TriggerProvider, TriggerSource} from "../hooks/useTrigger";
import {PropsWithChildren, useEffect, useState} from "react";
import {Note} from "../music/Note";
import {useTransport} from "../hooks/useTransport";

const sequence: Note[] = [
    Note["C4"],
    Note['D#4'],
    Note['G4'],
    Note['A4'],
    Note['A#4'],
    Note['A4'],
    Note['G4'],
    Note['D#4'],
]
const pulsePerStep = 2;

export interface Props {
    gate: number;
}

export const SequenceTrigger = ({children, gate}: PropsWithChildren<{ gate: number }>) => {
    const trigger = useSingleton(() => new TriggerSource());
    const transport = useTransport();

    const [pulse, setPulse] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [step, setStep] = useState(0);

    useEffect(() => {
        return transport.unsubscribe(
            transport.addEventListener('play', () => {
                setPlaying(true);
                setPulse(0);
            }),
            transport.addEventListener('stop', () => {
                setPlaying(false);
                setPulse(0);
            }),
            transport.addEventListener('pulse', () => {
                setPulse(prev => (prev + 1) % (pulsePerStep * sequence.length));
            })
        );
    }, [transport, pulsePerStep]);

    useEffect(() => {
        setStep(Math.floor(pulse / pulsePerStep));
    }, [pulse, pulsePerStep]);


    useEffect(() => {
        if (!playing) {
            return;
        }
        // trigger current note
        const event = {
            note: sequence[step]
        };
        trigger.fire('noteOn', event);
        setTimeout(() => {
            trigger.fire('noteOff', event)
        }, gate * 1000);
    }, [step, sequence, gate, playing]);

    return (
        <TriggerProvider source={trigger}>
            {children}
        </TriggerProvider>
    );
}
