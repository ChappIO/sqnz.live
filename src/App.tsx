import {useHotkey} from "./hooks/useHotkey";
import {useState} from "react";
import {Header} from "./components/Header";
import {TrackProvider} from "./hooks/useTrack";

export const App = () => {
    const [screen, setScreen] = useState<'sequencer' | 'instrument' | 'fx' | 'mixer' | 'master_fx'>('sequencer');

    useHotkey('Digit1', () => {
        setScreen('sequencer');
    });
    useHotkey('Digit2', () => {
        setScreen('instrument');
    });
    useHotkey('Digit3', () => {
        setScreen('fx');
    });
    useHotkey('Digit4', () => {
        setScreen('mixer');
    });
    useHotkey('Digit5', () => {
        setScreen('master_fx');
    });
    return (
        <TrackProvider>
            <Header/>
            {screen}
        </TrackProvider>
    );
}
