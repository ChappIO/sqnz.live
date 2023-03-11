import {createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useState} from "react";

type Register = Record<string, AudioNode>;

const Context = createContext<[Register, Dispatch<SetStateAction<Register>>]>([{}, () => {
}]);

export const AudioNodeRegisterProvider = ({children}: PropsWithChildren) => {
    return <Context.Provider value={useState<Record<string, AudioNode>>({})}>{children}</Context.Provider>;
};

export const useRegisterAudioNode = (key: string, node: AudioNode) => {
    const [, setRegister] = useContext(Context);

    useEffect(() => {
        setRegister(prev => ({
            ...prev,
            [key]: node
        }));

        console.debug(`Register ${key}: ${node.constructor.name}`)

        return () => {
            setRegister(prev => {
                const copy = {...prev};
                delete copy[key];
                return copy;
            });
        };
    }, [key, node, setRegister]);
};

export const useAudioNode = (key: string | undefined): AudioNode | undefined => {
    const [register] = useContext(Context);
    if (!key) {
        return undefined;
    }
    return register[key];
}
