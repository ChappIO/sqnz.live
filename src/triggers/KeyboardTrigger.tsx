import {TriggerProvider, TriggerSource} from "../hooks/useTrigger";
import {useSingleton} from "../hooks/useSingleton";
import {PropsWithChildren, useCallback} from "react";
import {useKey} from "../hooks/useKeyDown";
import {Note} from "../music/Note";

const useNote = (key: string, note: Note, trigger: TriggerSource) => {
    useKey('keydown', key, useCallback(() => {
        trigger.fire('noteOn', {
            note
        });
    }, [trigger, note, key]));

    useKey('keyup', key, useCallback(() => {
        trigger.fire('noteOff', {
            note
        });
    }, [trigger, note, key]));
}

export const KeyboardTrigger = ({children}: PropsWithChildren) => {
    const trigger = useSingleton(() => new TriggerSource());

    useNote('a', Note['C3'], trigger);
    useNote('w', Note['C#3'], trigger);
    useNote('s', Note['D3'], trigger);
    useNote('e', Note['D#3'], trigger);
    useNote('d', Note['E3'], trigger);
    useNote('f', Note['F3'], trigger);
    useNote('t', Note['F#3'], trigger);
    useNote('g', Note['G3'], trigger);
    useNote('y', Note['G#3'], trigger);
    useNote('h', Note['A3'], trigger);
    useNote('u', Note['A#3'], trigger);
    useNote('j', Note['B3'], trigger);
    useNote('k', Note['C4'], trigger);
    useNote('o', Note['C#4'], trigger);
    useNote('l', Note['D4'], trigger);
    useNote('p', Note['D#4'], trigger);
    useNote(';', Note['E4'], trigger);

    return (
        <TriggerProvider source={trigger}>
            {children}
        </TriggerProvider>
    );
}
