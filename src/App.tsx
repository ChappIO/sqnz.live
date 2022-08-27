import React, {useState} from 'react';
import {Mixer} from "./components/Mixer";
import {Instrument} from "./components/Instrument";
import {useAudioContext} from "./hooks/useAudioContext";

export const App = () => {
    const context = useAudioContext();
    const [playing, setPlaying] = useState(false);

    return (
        <div>
            <h1>SQNZ.<sub>live</sub>
                <button onClick={() => {
                    if (playing) {
                        setPlaying(false);
                        context.suspend();
                    } else {
                        setPlaying(true);
                        context.resume();
                    }
                }}>{playing ? 'Stop' : 'Play'}</button>
            </h1>
            <Mixer>
                <Instrument/>
            </Mixer>
        </div>
    );
}
