import {Oscillator, Props as OscillatorProps} from "../components/audio/Oscillator";
import {Instrument} from "../components/Instrument";
import {EnvelopeADSR} from "../components/audio/EnvelopeADSR";
import {useState} from "react";
import {Reverb, ReverbPreset, ReverbPresets} from "../components/audio/Reverb";
import {Knob} from "../components/Knob";
import {Amplifier} from "../components/audio/Amplifier";

export const DigitalSynth = () => {
    const [oscillators, setOscillators] = useState<OscillatorProps[]>([
        {
            type: 'sine',
            tune: 0,
            fineTune: 0
        }
    ]);
    const [reverbPreset, setReverbPreset] = useState<ReverbPreset | undefined>();

    return (
        <Instrument
            name="DigitalSynth"
            macroControls={
                <></>
            }
            settings={
                <>
                    <section>
                        <h3>Oscillators</h3>
                        <div className="section-content">
                            {oscillators.map((osc, i) => (
                                <div className="component" key={i}>
                                    <select value={osc.type}
                                            onChange={
                                                (e) => {
                                                    setOscillators(prev => {
                                                        const next = [...prev];
                                                        next.splice(i, 1, {
                                                            ...osc,
                                                            type: e.target.value as OscillatorType
                                                        })
                                                        return next;
                                                    });
                                                }
                                            }>
                                        <option value="sine">Sine</option>
                                        <option value="triangle">Triangle</option>
                                    </select>
                                    <div className="knobs">
                                        <Knob label={`tune ${osc.tune}`} min={-24} max={24} value={osc.tune}
                                              defaultValue={0} onChange={(value) => {
                                            setOscillators(prev => {
                                                const next = [...prev];
                                                next.splice(i, 1, {
                                                    ...osc,
                                                    tune: value
                                                })
                                                return next;
                                            });
                                        }}/>
                                        <Knob label={`detune ${osc.fineTune}`} min={-100} max={100} value={osc.fineTune}
                                              defaultValue={0} onChange={(value) => {
                                            setOscillators(prev => {
                                                const next = [...prev];
                                                next.splice(i, 1, {
                                                    ...osc,
                                                    fineTune: value
                                                })
                                                return next;
                                            });
                                        }}/>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => setOscillators(prev => (
                                [
                                    ...prev,
                                    {
                                        type: 'sine',
                                        tune: 0,
                                        fineTune: 0,
                                    }
                                ]
                            ))}>Add
                            </button>
                        </div>
                    </section>
                    <section>
                        <h3>FX</h3>
                        <div className="section-content">
                            <select value={reverbPreset} onChange={e => {
                                setReverbPreset(e.target.value as ReverbPreset)
                            }}>
                                <option>No Reverb</option>
                                {
                                    ReverbPresets.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </section>
                </>
            }
            audioEngine={
                <>
                    <Reverb preset={reverbPreset}>
                        <EnvelopeADSR attack={0.02} decay={0.1} sustain={0.4} release={0.3}>
                            <Amplifier volume={100 / oscillators.length}>
                                {oscillators.map((osc, i) => (
                                    <Oscillator key={i} {...osc}/>
                                ))}
                            </Amplifier>
                        </EnvelopeADSR>
                    </Reverb>
                </>
            }
        />
    );
}
