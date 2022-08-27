import {PropsWithChildren, useCallback} from "react";
import {TriggerProvider, TriggerSource} from "../hooks/useTrigger";
import {useSingleton} from "../hooks/useSingleton";
import {Tone} from "../music/Note";
import {useKeyDown} from "../hooks/useKeyDown";

const useKey = (key: string, source: TriggerSource, tone: Tone) => {
    useKeyDown(key, useCallback(() => {
        source.fire('trigger', {
            note: {
                tone: tone,
                gate: 200
            }
        })
    }, [source, tone]));
}
export const TriggerKeyboard = ({children}: PropsWithChildren) => {
    const source = useSingleton(() => new TriggerSource());

    useKey('a', source, Tone.C3);
    useKey('w', source, Tone['C#3']);
    useKey('s', source, Tone.D3);
    useKey('e', source, Tone['D#3']);
    useKey('d', source, Tone.E3);
    useKey('f', source, Tone.F3);
    useKey('t', source, Tone['F#3']);
    useKey('g', source, Tone.G3);
    useKey('y', source, Tone['G#3']);
    useKey('h', source, Tone.A3);
    useKey('u', source, Tone['A#3']);
    useKey('j', source, Tone.B3);
    useKey('k', source, Tone.C4);

    return (
        <TriggerProvider source={source}>
            {children}
        </TriggerProvider>

    )
}
