import {useDestination} from "../hooks/useDestination";
import {useCallback, useEffect} from "react";
import {useAudioContext} from "../hooks/useAudioContext";
import {useSingleton} from "../hooks/useSingleton";
import {useTransport} from "../hooks/useTransport";
import {useTrigger} from "../hooks/useTrigger";

export interface Props {
    type: OscillatorType
    detune?: number;
}

export const Oscillator = ({type, detune}: Props) => {
    const transport = useTransport();
    const context = useAudioContext();
    const destination = useDestination();
    const osc = useSingleton(() => {
        const osc = context.createOscillator();
        osc.start();
        return osc;
    });

    useEffect(() => {
        osc.type = type;
    }, [type, osc]);

    useEffect(() => {
        osc.detune.setValueAtTime(detune || 0, context.currentTime);
    }, [detune, context, osc]);

    useTrigger(useCallback(({note}) => {
        osc.frequency.setTargetAtTime(note.tone, context.currentTime, 0.001);
    }, [osc, context]));

    useEffect(() => {
        return transport.unsubscribe(
            transport.addEventListener('play', () => {
                osc.connect(destination);
            }),
            transport.addEventListener('stop', () => {
                osc.disconnect()
            })
        )
    }, [osc, transport, destination]);

    return (
        <></>
    );
}
