import {PropsWithChildren, useState} from "react";
import './SplashScreen.scss';
import {start} from "tone";

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