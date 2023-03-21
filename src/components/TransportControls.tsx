import {useEffect, useState} from "react";
import {Transport} from "tone";

export const TransportControls = () => {
    const [state, setState] = useState<'started' | 'stopped' | 'paused'>(Transport.state);

    useEffect(() => {
        Transport.on('start', () => {
            setState('started');
        });
        Transport.on('stop', () => {
            setState('stopped');
        });
        Transport.on('pause', () => {
            setState('paused');
        });
    }, []);

    switch (state) {
        case "stopped":
            return (
                <>
                    <button className="btn-success" onClick={() => {
                        Transport.start();
                    }}>
                        <i className="fas fa-play"/>
                    </button>
                    <button className="btn-danger-outline" disabled>
                        <i className="fas fa-stop"/>
                    </button>
                </>
            );
        case "started":
            return (
                <>
                    <button className="btn-primary" onClick={() => {
                        Transport.pause();
                    }}>
                        <i className="fas fa-pause"/>
                    </button>
                    <button className="btn-danger" onClick={() => {
                        Transport.stop();
                    }}>
                        <i className="fas fa-stop"/>
                    </button>
                </>
            );
        case "paused":
            return (
                <>
                    <button className="btn-success" onClick={() => {
                        Transport.start();
                    }}>
                        <i className="fas fa-play"/>
                    </button>
                    <button className="btn-danger" onClick={() => {
                        Transport.stop();
                    }}>
                        <i className="fas fa-stop"/>
                    </button>
                </>
            );
        default:
            return (
                <>
                    {state}
                </>
            );
    }
}