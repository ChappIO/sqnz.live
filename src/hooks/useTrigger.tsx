import {createContext, PropsWithChildren, useContext} from "react";
import {EventEmitter} from "../utils/EventEmitter";
import {Note} from "../music/Note";

export interface TriggerEvent {
    noteOn: {
        note: Note;
        gateLength: number;
    }
    gateOpen: void;
    gateClose: void;
}

export class TriggerSource extends EventEmitter<TriggerEvent> {
    private openNotes = 0;

    constructor() {
        super();

        this.addEventListener('noteOn', ({gateLength}) => {
            if (this.openNotes++ === 0) {
                this.fire("gateOpen", undefined);
            }
            setTimeout(() => {
                if (--this.openNotes === 0) {
                    this.fire("gateClose", undefined);
                }
            }, gateLength * 1000)
        });
    }
}

const Context = createContext<TriggerSource>(new TriggerSource());

export const useTrigger = () => useContext(Context)!;

export interface Props {
    source: TriggerSource;
}

export const TriggerProvider = ({source, children}: PropsWithChildren<Props>) => (
    <Context.Provider value={source}>{children}</Context.Provider>
)
