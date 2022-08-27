import {createContext, PropsWithChildren, useContext} from "react";

const Context = createContext<AudioNode | undefined>(undefined);

export const useDestination = () => useContext(Context)!;

export interface Props {
    destination: AudioNode
}

export const AudioDestinationProvider = ({children, destination}: PropsWithChildren<Props>) => {
    return (
        <Context.Provider value={destination}>
            {children}
        </Context.Provider>
    );
}
