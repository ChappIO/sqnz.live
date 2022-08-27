import {PropsWithChildren} from "react";
import {TriggerProvider, TriggerSource} from "../hooks/useTrigger";
import {useSingleton} from "../hooks/useSingleton";
import {Note} from "../music/Note";


export interface Props {
    note: Note
}

export const TriggerButton = ({children, note}: PropsWithChildren<Props>) => {
    const source = useSingleton(() => new TriggerSource());
    return (
        <>
            <button onClick={() => {
                source.fire('trigger', {note});
            }}>Go!
            </button>
            <TriggerProvider source={source}>
                {children}
            </TriggerProvider>
        </>
    )
}
