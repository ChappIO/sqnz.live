import {createContext, PropsWithChildren, useContext, useEffect} from "react";
import {EventEmitter, EventListener} from "../utils/EventEmitter";
import {Note} from "../music/Note";

export interface TriggerEvent {
    trigger: {
        note: Note;
    }
}

export class TriggerSource extends EventEmitter<TriggerEvent> {
}

const Context = createContext<TriggerSource>(new TriggerSource());

export const useTrigger = (listener: EventListener<TriggerEvent['trigger']>) => {
    const source = useContext(Context);

    useEffect(() => {
        console.log('register');
        return source.addEventListener('trigger', listener);
    }, [listener, source]);
};

export interface Props {
    source: TriggerSource;
}

export const TriggerProvider = ({source, children}: PropsWithChildren<Props>) => (
    <Context.Provider value={source}>{children}</Context.Provider>
)
