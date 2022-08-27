import {createContext, PropsWithChildren, useContext, useState} from "react";

const Context = createContext(new AudioContext());

export const useAudioContext = () => useContext(Context);

export const AudioContextProvider = ({children}: PropsWithChildren) => {
    const [context] = useState(() => new AudioContext());
    return (
        <Context.Provider value={context}>
            {children}
        </Context.Provider>
    );
}
