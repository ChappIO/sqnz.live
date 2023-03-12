import {
    createContext,
    Dispatch,
    PropsWithChildren,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useState
} from "react";
import {Note} from "tonal";

export class Trigger {
    public readonly details: Record<string, any> = {};
    private detuneValue = 0;
    private triggerHandlerCounter = 0;
    private readonly triggerStopHandlers: Record<number, TriggerHandler> = {};
    private readonly triggerDetuneHandlers: Record<number, TriggerHandler> = {};

    constructor(public readonly id: number, public readonly note: ReturnType<(typeof Note)['get']>) {
    }

    public get detune() {
        return this.detuneValue;
    }

    public set detune(value: number) {
        this.detuneValue = value;
        for (let key in this.triggerDetuneHandlers) {
            this.triggerDetuneHandlers[key](this);
        }
    }

    stop() {
        for (let triggerStopHandlersKey in this.triggerStopHandlers) {
            this.triggerStopHandlers[triggerStopHandlersKey](this);
        }
    }

    onStop(handler: TriggerHandler): Unsubscribe {
        const id = this.triggerHandlerCounter++;
        this.triggerStopHandlers[id] = handler;
        return () => {
            delete this.triggerStopHandlers[id];
        }
    }

    onDetune(handler: TriggerHandler): Unsubscribe {
        const id = this.triggerHandlerCounter++;
        this.triggerDetuneHandlers[id] = handler;
        return () => {
            delete this.triggerDetuneHandlers[id];
        }
    }
}

export type TriggerHandler = (trigger: Trigger) => void;

export type Unsubscribe = () => void;

let globalNodeCounter = Date.now();

export class TriggerNode {
    private readonly triggerHandlers: Record<number, TriggerHandler> = {};
    private triggerHandlerCounter = 0;
    private readonly triggers: Record<number, Trigger> = {};

    fire(uniqueId: number | undefined, noteName: string, details: Record<string, any> = {}): Trigger {
        const note = Note.get(noteName);
        if (!uniqueId) {
            uniqueId = globalNodeCounter++;
        }
        const trigger = new Trigger(
            uniqueId,
            note
        );
        Object.assign(trigger.details, details);
        this.triggers[uniqueId] = trigger;

        for (let triggerHandlersKey in this.triggerHandlers) {
            this.triggerHandlers[triggerHandlersKey](trigger);
        }
        return trigger;
    }

    get(uniqueId: number): Trigger | undefined {
        return this.triggers[uniqueId];
    }

    onTrigger(handler: TriggerHandler): Unsubscribe {
        const handlerId = this.triggerHandlerCounter++;
        this.triggerHandlers[handlerId] = handler;

        return () => {
            delete this.triggerHandlers[handlerId];
        };
    }
}

type Register = Record<string, TriggerNode>;

const Context = createContext<[Register, Dispatch<SetStateAction<Register>>]>([{}, () => {
}]);

export const TriggerNodeRegisterProvider = ({children}: PropsWithChildren) => {
    return <Context.Provider value={useState<Record<string, TriggerNode>>({})}>{children}</Context.Provider>;
};

export const useRegisterTriggerReceiver = (key: string, node: TriggerNode) => {
    const [, setRegister] = useContext(Context);

    useEffect(() => {
        setRegister(prev => ({
            ...prev,
            [key]: node
        }));

        console.debug(`Register Trigger Receiver ${key}`)

        return () => {
            setRegister(prev => {
                const copy = {...prev};
                delete copy[key];
                return copy;
            });
        };
    }, [key, node, setRegister]);
};

export const useGetTriggerNode = () => {
    const [register] = useContext(Context);

    return useCallback((key: string): TriggerNode | undefined => register[key], [register]);
}
