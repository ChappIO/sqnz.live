import {useTransport} from "../hooks/useTransport";
import {Knob} from "./Knob";
import {useEffect, useState} from "react";
import {useReload} from "../hooks/useReload";
import {Metronome} from "./Metronome";
import {Amplifier} from "./Amplifier";

export const TransportControls = () => {
    const transport = useTransport();
    const [bpm, setBpm] = useState(120);
    const reload = useReload();

    useEffect(() => {
        transport.setBpm(bpm);
    }, [transport, bpm]);

    return (
        <div className="transport-controls">
            <button onClick={() => {
                if (transport.isPlaying()) {
                    transport.stop();
                } else {
                    transport.play();
                }
                reload();
            }}>
                {transport.isPlaying() ? "Stop" : "Play"}
            </button>
            <Knob label={`${bpm} bpm`} min={20} max={200} value={bpm} defaultValue={120} onChange={setBpm}/>
            <Amplifier defaultValue={0} max={100} label="beep">
                <Metronome/>
            </Amplifier>
        </div>
    );
}
