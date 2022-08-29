import {useAudioNode} from "../../hooks/useAudioNode";
import {useEffect} from "react";
import {useTrigger} from "../../hooks/useTrigger";

export interface Props {
    type: OscillatorType;
    tune: number;
    fineTune: number;
}

export const Oscillator = ({type, tune, fineTune}: Props): null => {
    const [context, osc] = useAudioNode((context) => context.createOscillator());
    const trigger = useTrigger();
    const detune = tune * 100 + fineTune;

    useEffect(() => {
        osc.start();
    }, [osc, context]);

    useEffect(() => {
        osc.detune.setValueAtTime(detune, context.currentTime);
    }, [osc, detune, context]);

    useEffect(() => {
        osc.type = type;
    }, [osc, type]);

    useEffect(() => {
        return trigger.addEventListener('noteOn', ({note}) => {
            osc.frequency.setValueAtTime(note, context.currentTime);
        });
    }, [osc, context, trigger]);

    return null;
}
