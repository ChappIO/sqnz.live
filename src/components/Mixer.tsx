import React, {PropsWithChildren} from "react";
import {useAudioContext} from "../hooks/useAudioContext";
import {AudioDestinationProvider} from "../hooks/useDestination";

export const Mixer = ({children}: PropsWithChildren) => {
    const masterOut = useAudioContext();

    return (
        <div className="mixer">
            <AudioDestinationProvider destination={masterOut.destination}>
                {children}
            </AudioDestinationProvider>
        </div>
    );
}
