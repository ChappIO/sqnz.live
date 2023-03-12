import {createContext, PropsWithChildren, useContext} from "react";
import {useSingleton} from "./useSingleton";

const Context = createContext<AudioContext | undefined>(undefined);

export const AudioContextProvider = ({children}: PropsWithChildren) => {
    const context = useSingleton(() => new AudioContext());

    return (
        <Context.Provider value={context}>
            {children}
        </Context.Provider>
    );
};
export const useAudioContext = () => useContext(Context)!;
