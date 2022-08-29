import {Oscillator, Props as OscillatorProps} from "../components/audio/Oscillator";
import {Instrument} from "../components/Instrument";
import {EnvelopeADSR} from "../components/audio/EnvelopeADSR";
import {useState} from "react";
import {Reverb, ReverbPreset, ReverbPresets} from "../components/audio/Reverb";
import {Knob} from "../components/Knob";
import {Amplifier} from "../components/audio/Amplifier";
import {Compressor} from "../components/audio/Compressor";

type OscillatorParams = OscillatorProps & {
    id: number;
    volume: number;
}

export const DigitalSynth = () => {
    const [oscillators, setOscillators] = useState<OscillatorParams[]>([
        {
            id: 0,
            type: 'sine',
            tune: 0,
            fineTune: 0,
            volume: 100,
        }
    ]);
    const [reverbPreset, setReverbPreset] = useState<ReverbPreset | undefined>();
    const [attack, setAttack] = useState(2);
    const [decay, setDecay] = useState(2);
    const [sustain, setSustain] = useState(1000);
    const [release, setRelease] = useState(2);

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
                                <div className="component" key={osc.id}>
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
                                        <option value="square">Square</option>
                                        <option value="sawtooth">Saw</option>
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
                                        <Knob label={`volume ${osc.volume}%`} min={0} max={100} value={osc.volume}
                                              defaultValue={100} onChange={(value) => {
                                            setOscillators(prev => {
                                                const next = [...prev];
                                                next.splice(i, 1, {
                                                    ...osc,
                                                    volume: value
                                                })
                                                return next;
                                            });
                                        }}/>
                                    </div>
                                    {osc.id !== 0 && (
                                        <button onClick={() => {
                                            setOscillators(prev => prev.filter(item => item.id !== osc.id))
                                        }}>Remove</button>
                                    )}
                                </div>
                            ))}
                            <button onClick={() => setOscillators(prev => (
                                [
                                    ...prev,
                                    {
                                        id: Date.now(),
                                        type: 'sine',
                                        tune: 0,
                                        fineTune: 0,
                                        volume: 100,
                                    }
                                ]
                            ))}>Add
                            </button>
                        </div>
                    </section>
                    <section>
                        <h3>Envelope</h3>
                        <div className="section-content">
                            <div className="knobs">
                                <Knob label="attack" min={0} max={1000} value={attack} defaultValue={20}
                                      onChange={setAttack}/>
                                <Knob label="decay" min={0} max={1000} value={decay} defaultValue={20}
                                      onChange={setDecay}/>
                            </div>
                            <div className="knobs">
                                <Knob label="sustain" min={0} max={1000} value={sustain} defaultValue={1000}
                                      onChange={setSustain}/>
                                <Knob label="release" min={0} max={1000} value={release} defaultValue={20}
                                      onChange={setRelease}/>
                            </div>
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
                <Compressor threshold={-50} knee={40} ratio={12} attack={0} release={0.25}>
                    <Reverb preset={reverbPreset}>
                        <EnvelopeADSR attack={attack / 1000} decay={decay / 1000} sustain={sustain / 1000}
                                      release={release / 1000}>
                            <Amplifier volume={100 / oscillators.length}>
                                {oscillators.map(({volume, ...osc}, i) => (
                                    <Amplifier key={i} volume={volume}>
                                        <Oscillator {...osc}/>
                                    </Amplifier>
                                ))}
                            </Amplifier>
                        </EnvelopeADSR>
                    </Reverb>
                </Compressor>
            }
        />
    );
}
