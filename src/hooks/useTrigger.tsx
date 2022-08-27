import {createContext, PropsWithChildren, useContext, useEffect} from "react";

export class TriggerSource {
    listeners: TriggerListener[] = [];

    addListener(listener: TriggerListener) {
        this.listeners.push(listener);
    }

    removeListener(listener: TriggerListener) {
        this.listeners = this.listeners.filter(l => l === listener);
    }

    fire() {
        this.listeners.forEach(l => l());
    }
}

export type TriggerListener = () => void;

const Context = createContext<TriggerSource>(new TriggerSource());

export const useTrigger = (listener: TriggerListener) => {
    const source = useContext(Context);

    useEffect(() => {
        source.addListener(listener);
        return () => source.removeListener(listener);
    }, [listener, source]);
};

export interface Props {
    source: TriggerSource;
}

export const TriggerProvider = ({source, children}: PropsWithChildren<Props>) => (
    <Context.Provider value={source}>{children}</Context.Provider>
)
