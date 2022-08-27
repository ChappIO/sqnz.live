import React, {useState} from 'react';
import {Mixer} from "./components/Mixer";
import {Instrument} from "./components/Instrument";
import {TransportControls} from "./components/TransportControls";
import {ReverbKnob} from "./components/ReverbKnob";
import {Tone} from "./music/Note";
import {TriggerSequence} from "./components/TriggerSequence";
import {Gate} from "./components/Gate";
import {MultimodeOscillator} from "./components/MutimodeOscillator";

export const App = () => {
    const [melody] = useState([
        {
            tone: Tone.C3,
            gate: 50
        }, {
            tone: Tone['D#3'],
            gate: 50
        }, {
            tone: Tone['G3'],
            gate: 50
        }, {
            tone: Tone['G#3'],
            gate: 50
        }, {
            tone: Tone['G3'],
            gate: 50
        }, {
            tone: Tone['D#3'],
            gate: 50
        }, {
            tone: Tone.C3,
            gate: 50
        }, {
            tone: Tone['D#3'],
            gate: 50
        },
    ]);
    const [bass] = useState([
        {
            tone: Tone.C2,
            gate: 50
        }
    ])
    return (
        <div>
            <h1>SQNZ.<sub>live</sub></h1>
            <TransportControls/>
            <Mixer>
                <ReverbKnob>
                    <Instrument>
                        <TriggerSequence interval={2} notes={melody}>
                            <Gate>
                                <MultimodeOscillator/>
                            </Gate>
                        </TriggerSequence>
                    </Instrument>
                    <Instrument>
                        <TriggerSequence interval={4} notes={bass}>
                            <Gate>
                                <MultimodeOscillator/>
                            </Gate>
                        </TriggerSequence>
                    </Instrument>
                </ReverbKnob>
            </Mixer>
        </div>
    );
}
