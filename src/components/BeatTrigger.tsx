import {PropsWithChildren, useEffect} from "react";
import {TriggerProvider, TriggerSource} from "../hooks/useTrigger";
import {useSingleton} from "../hooks/useSingleton";
import {useTransport} from "../hooks/useTransport";


export const BeatTrigger = ({children}: PropsWithChildren) => {
    const source = useSingleton(() => new TriggerSource());
    const transport = useTransport();
    useEffect(() => {
        let i = -1;
        return transport.unsubscribe(
            transport.addEventListener('stop', () => {
                i = -1;
            }),
            transport.addEventListener('pulse', () => {
                if (++i % 4 === 0) {
                    source.fire('trigger', {});
                }
            })
        );
    }, [source, transport]);
    return (

        <TriggerProvider source={source}>
            {children}
        </TriggerProvider>

    )
}
