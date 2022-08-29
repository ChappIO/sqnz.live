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
const pulsePerStep = 4;

export interface Props {
    onTrigger: () => void;
}

export const SequenceTrigger = ({children, onTrigger}: PropsWithChildren<Props>) => {
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
    }, [transport]);

    useEffect(() => {
        setStep(Math.floor(pulse / pulsePerStep));
    }, [pulse]);


    useEffect(() => {
        if (!playing) {
            return;
        }
        // trigger current note
        trigger.fire('noteOn', {
            note: sequence[step],
            gateLength: 0.2,
        });
        onTrigger();
    }, [step, trigger, onTrigger, playing]);

    return (
        <TriggerProvider source={trigger}>
            {children}
        </TriggerProvider>
    );
}
