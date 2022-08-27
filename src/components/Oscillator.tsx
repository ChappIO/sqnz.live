import {useDestination} from "../hooks/useDestination";
import {useEffect} from "react";
import {useAudioContext} from "../hooks/useAudioContext";

export const Oscillator = () => {
    const context = useAudioContext();
    const destination = useDestination();
    useEffect(() => {
        const osc = context.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, context.currentTime);
        osc.connect(destination);

        context.resume().then(() => {
            osc.start();
        });

        return () => osc.disconnect();
    });

    return (
        <></>
    );
}
