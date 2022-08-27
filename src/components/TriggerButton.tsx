import {PropsWithChildren, useState} from "react";
import {TriggerProvider, TriggerSource} from "../hooks/useTrigger";


export const TriggerButton = ({children}: PropsWithChildren) => {
    const [source] = useState(() => {
        console.log('creating trigger source');
        return new TriggerSource();
    });
    return (
        <>
            <button onClick={() => {
                source.fire();
            }}>Go!
            </button>
            <TriggerProvider source={source}>
                {children}
            </TriggerProvider>
        </>
    )
}
