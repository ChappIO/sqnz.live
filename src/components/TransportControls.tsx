import {useTransport} from "../hooks/useTransport";
import {Knob} from "./Knob";
import {useCallback, useEffect, useState} from "react";
import {useReload} from "../hooks/useReload";
import {useKey} from "../hooks/useKeyDown";

export const TransportControls = () => {
    const transport = useTransport();
    const [bpm, setBpm] = useState(120);
    const reload = useReload();
    useKey('keydown', ' ', useCallback(() => {
        if (transport.isPlaying()) {
            transport.stop();
        } else {
            transport.play();
        }
    }, [transport]));

    useEffect(() => {
        transport.setBpm(bpm);
    }, [transport, bpm]);

    useEffect(() => {
        return transport.unsubscribe(
            transport.addEventListener('play', () => reload()),
            transport.addEventListener('stop', () => reload())
        )
    }, [transport, reload]);

    return (
        <div className="transport-controls">
            <button className={`is-danger ${transport.isPlaying() ? '' : 'active'}`} onClick={() => {
                transport.stop();
            }}>
                <i className="fas  fa-stop"/>
            </button>
            <button className={`is-success ${transport.isPlaying() ? 'active' : ''}`} onClick={() => {
                transport.play();
            }}>
                <i className="fas  fa-play"/>
            </button>
            <Knob label={`${bpm} bpm`} min={20} max={200} value={bpm} defaultValue={120} onChange={setBpm}/>
        </div>
    );
}
