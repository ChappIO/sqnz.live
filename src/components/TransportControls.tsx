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
                <div className="TransportControls">
                    <button className="btn-success" onClick={() => {
                        console.log('hi');
                        Transport.start();
                    }}>
                        <i className="fas fa-play"/>
                    </button>
                    <button className="btn-danger-outline" disabled>
                        <i className="fas fa-stop"/>
                    </button>
                </div>
            );
        case "started":
            return (
                <div className="TransportControls">
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
                </div>
            );
        case "paused":
            return (
                <div className="TransportControls">
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
                </div>
            );
        default:
            return (
                <div className="TransportControls">
                    {state}
                </div>
            );
    }
}