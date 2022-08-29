import React, {PropsWithChildren, ReactElement, useState} from "react";
import {DigitalSynth} from "../instruments/DigitalSynth";

export const Mixer = ({children}: PropsWithChildren) => {
    const [instruments, setInstruments] = useState<ReactElement[]>([
        <DigitalSynth key={Date.now()}/>
    ]);

    return (
        <div className="mixer">
            {instruments}
            <button onClick={() => {
                setInstruments(prev => [
                    ...prev,
                    <DigitalSynth key={Date.now()}/>
                ])
            }}>Add
            </button>
        </div>
    );
}
