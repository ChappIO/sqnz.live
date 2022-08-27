import {PropsWithChildren, useEffect} from "react";
import {TriggerProvider, TriggerSource} from "../hooks/useTrigger";
import {useSingleton} from "../hooks/useSingleton";
import {useTransport} from "../hooks/useTransport";
import {Note} from "../music/Note";

export interface Props {
    interval: number;
    notes: Note[];
}

export const TriggerSequence = ({children, notes, interval}: PropsWithChildren<Props>) => {
    const source = useSingleton(() => new TriggerSource());
    const transport = useTransport();
    useEffect(() => {
        let i = -1;
        return transport.unsubscribe(
            transport.addEventListener('play', () => {
                i = -1;
            }),
            transport.addEventListener('stop', () => {
                i = -1;
            }),
            transport.addEventListener('pulse', () => {
                if (++i % interval === 0) {
                    source.fire('trigger', {
                        note: notes[Math.floor(i / interval) % notes.length]
                    });
                }
            })
        );
    }, [source, transport, notes, interval]);
    return (
        <TriggerProvider source={source}>
            {children}
        </TriggerProvider>
    )
}
