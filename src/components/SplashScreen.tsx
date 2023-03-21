import {PropsWithChildren, useState} from "react";
import './SplashScreen.scss';
import {Loop, PolySynth, start} from "tone";

export const SplashScreen = ({children}: PropsWithChildren) => {
    const [started, setStarted] = useState(false);

    if (started) {
        return <>{children}</>;
    }

    return (
        <div className="SplashScreen">
            <h1>SQNZ<sub>.live</sub></h1>
            <button onClick={async () => {
                await start();
                const synth = new PolySynth();
                synth.toDestination();
                new Loop(
                    time => {
                        synth.triggerAttackRelease('C4', '8n');
                    },
                    '8n'
                ).start('0');
                new Loop(
                    time => {
                        synth.triggerAttackRelease('C6', '8n');
                    },
                    '1m'
                ).start('0');
                setStarted(true);
            }}>
                Start!
            </button>
            <span>
                Your Musical Sketchpad.
            </span>
        </div>
    )
}