import { createContext, PropsWithChildren, useContext } from "react";
import { useSingleton } from "./useSingleton";
import { AudioDestinationProvider } from "./useDestination";

const Context = createContext<AudioContext | undefined>(undefined);

export const AudioContextProvider = ({ children }: PropsWithChildren) => {
  const context = useSingleton(() => new AudioContext());

  return (
    <Context.Provider value={context}>
      <AudioDestinationProvider destination={context.destination}>
        {children}
      </AudioDestinationProvider>
    </Context.Provider>
  );
};
export const useAudioContext = () => useContext(Context)!;
