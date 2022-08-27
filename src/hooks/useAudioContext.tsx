import {createContext, PropsWithChildren, useContext, useEffect} from "react";
import {useTransport} from "./useTransport";
import {useSingleton} from "./useSingleton";
import {AudioDestinationProvider} from "./useDestination";

const Context = createContext(new AudioContext());

export const useAudioContext = () => useContext(Context);

export const AudioContextProvider = ({children}: PropsWithChildren) => {
    const context = useSingleton(() => new AudioContext());
    const transport = useTransport();

    useEffect(() => {
        async function play() {
            await context.resume();
        }

        async function stop() {
            await context.suspend();
        }

        transport.addEventListener('play', play);
        transport.addEventListener('stop', stop);

        return () => {
            transport.removeEventListener('play', play);
            transport.removeEventListener('stop', stop);
        }
    }, [context, transport]);

    return (
        <Context.Provider value={context}>
            <AudioDestinationProvider destination={context.destination}>
                {children}
            </AudioDestinationProvider>
        </Context.Provider>
    );
}
