import {createContext, PropsWithChildren, useContext, useState} from "react";
import {useAudioContext} from "../hooks/useAudioContext";

export interface Props {
    id: number | string;
    posX: number;
    posY: number;
}

export type NodeSlotContext = Props & {
    context: AudioContext;
    destination?: AudioNode;
}

const Context = createContext<NodeSlotContext | undefined>(undefined);

export const NodeSlot = ({children, ...props}: PropsWithChildren<Props>) => {
    const context = useAudioContext();
    const [destination, setDestination] = useState<AudioNode>(context.destination);
    return <Context.Provider value={{
        ...props,
        destination,
        context,
    }}>
        {children}
    </Context.Provider>
}

export const useNodeSlot = () => useContext(Context)!;
