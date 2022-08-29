import React, {ReactElement, useState} from "react";
import {DigitalSynth} from "../instruments/DigitalSynth";

export const Mixer = () => {
    const [instruments, setInstruments] = useState<ReactElement[]>([]);

    return (
        <div className="mixer">
            {instruments}
            <button onClick={() => {
                setInstruments(prev => [
                    ...prev,
                    <DigitalSynth key={Date.now()}/>
                ])
            }}>
                <i className="fas fa-plus"/>
            </button>
        </div>
    );
}
