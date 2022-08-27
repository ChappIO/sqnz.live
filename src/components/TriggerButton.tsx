import {PropsWithChildren} from "react";
import {TriggerProvider, TriggerSource} from "../hooks/useTrigger";
import {useSingleton} from "../hooks/useSingleton";


export const TriggerButton = ({children}: PropsWithChildren) => {
    const source = useSingleton(() => new TriggerSource());
    return (
        <>
            <button onClick={() => {
                source.fire('trigger', {});
            }}>Go!
            </button>
            <TriggerProvider source={source}>
                {children}
            </TriggerProvider>
        </>
    )
}
