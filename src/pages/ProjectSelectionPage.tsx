import "./ProjectSelectionPage.scss"
import {PropsWithChildren, useState} from "react";
import {useAudioContext} from "../hooks/useAudioContext";

export const ProjectSelectionPage = ({children}: PropsWithChildren) => {
    const [started, setStarted] = useState(false);
    const context = useAudioContext();

    if (started) {
        return (
            <>
                {children}
            </>
        )
    }

    return (
        <div className="ProjectSelectionPage">
            <h1>SQNZ<sub>.live</sub></h1>
            <button onClick={async () => {
                await context.resume();
                setStarted(true);
            }}>Play
            </button>
            <p>
                A musical sketchpad
            </p>

            <div className="WorksBestOnPhones">
                This app works best on mobile phones in landscape mode.
            </div>
        </div>
    );
}