import {PlayButton} from "./components/PlayButton";
import React from "react";
import {AudioContextProvider} from "./hooks/useAudioContext";
import {Expresso} from "./instruments/Expresso";

export const App = ({}) => {
    return (
        <AudioContextProvider>
            <PlayButton>
                <Expresso/>
            </PlayButton>
        </AudioContextProvider>
    );
}