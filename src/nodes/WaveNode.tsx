import {CustomNode, Node, NodeProps} from "./Node";
import {useAudioContext} from "../hooks/useAudioContext";
import {useGetAudioNode} from "../hooks/useAudioNodeRegister";
import {usePersistedState} from "../hooks/usePersistedState";
import {useProject} from "../hooks/useProject";
import {useSingleton} from "../hooks/useSingleton";
import {Trigger, TriggerNode, useRegisterTriggerReceiver} from "../hooks/useTriggerNodeRegister";
import {useCallback, useEffect} from "react";
import {Interval, Note} from "tonal";

export const WaveNode: CustomNode = ({...nodeProps}: NodeProps) => {
    const project = useProject();
    const [waveform, setWaveform] = usePersistedState<OscillatorType>('waveform', 'sine', {
        namespace: `${project.namespace}/nodes/${nodeProps.id}`
    });
    const [oct, setOct] = usePersistedState<number>('oct', 0, {
        namespace: `${project.namespace}/nodes/${nodeProps.id}`
    });
    const [tune, setTune] = usePersistedState<number>('tune', 0, {
        namespace: `${project.namespace}/nodes/${nodeProps.id}`
    });
    const [detune, setDetune] = usePersistedState<number>('detune', 0, {
        namespace: `${project.namespace}/nodes/${nodeProps.id}`
    });
    const destinations = nodeProps.outputs.filter(o => o.type === 'audio').map(o => o.to);
    const getAudioNode = useGetAudioNode();
    const context = useAudioContext();
    const trigger = useSingleton(() => new TriggerNode());
    useRegisterTriggerReceiver(nodeProps.id, trigger);


    const playNote = useCallback((trigger: Trigger) => {
        const gain = context.createGain();
        destinations.forEach(key => {
            const destination = getAudioNode(key);
            if (destination) {
                gain.connect(destination);
            }
        });
        gain.gain.setValueAtTime(0, context.currentTime);
        gain.gain.setTargetAtTime(1, context.currentTime, 0.01);
        const osc = context.createOscillator();
        osc.frequency.setValueAtTime(
            Note.get(Note.transpose(trigger.note.name, Interval.fromSemitones(tune + (12 * oct)))).freq!,
            context.currentTime
        );
        osc.type = waveform;
        osc.detune.setValueAtTime(detune, context.currentTime);
        osc.connect(gain);
        osc.start();

        trigger.onStop(() => {
            gain.gain.setTargetAtTime(0, context.currentTime, 0.02);
            setTimeout(() => {
                osc.disconnect();
                gain.disconnect();
            }, 1000);
        });

        trigger.onDetune((trigger) => {
            osc.detune.setValueAtTime(detune + (trigger.detune * 100), context.currentTime);
        });
    }, [context, destinations, detune, getAudioNode, tune, oct, waveform]);

    useEffect(() => {
        return trigger.onTrigger((trigger) => {
            playNote(trigger);
        });
    }, [trigger, playNote]);

    function testNote() {
        const trigger = new Trigger(
            Date.now(),
            Note.get("C4")
        );
        playNote(trigger);
        setTimeout(() => {
            trigger.stop();
        }, 500);
    }

    return (
        <Node {...nodeProps}
              node={WaveNode}
              modalActions={<>
                  <button className="btn-success" onClick={testNote}>
                      Test <i className="fas fa-play"/>
                  </button>
              </>}
        >
            <div className="form-group">
                <label htmlFor="waveform"
                       onClick={(e) => {
                           e.preventDefault();
                           setWaveform('sine');
                       }}>Waveform</label>
                <select id="waveform" value={waveform} onChange={(e) => setWaveform(e.target.value as any)}>
                    <option value="sine">Sine</option>
                    <option value="triangle">Triangle</option>
                    <option value="square">Square</option>
                    <option value="sawtooth">Saw</option>
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="oct"
                       onClick={() => {
                           setOct(0);
                       }}>
                    Oct
                </label>
                <input className="input-block"
                       type="range"
                       name="oct"
                       id="oct"
                       min="-4"
                       max="4"
                       value={oct}
                       onChange={e => {
                           setOct(parseInt(e.target.value))
                       }}
                />
                <output id="output" htmlFor="oct">{oct > 0 && '+'}{oct}</output>
            </div>
            <div className="form-group">
                <label htmlFor="tune"
                       onClick={() => {
                           setTune(0);
                       }}>
                    Tune
                </label>
                <input className="input-block"
                       type="range"
                       name="tune"
                       id="tune"
                       min="-24"
                       max="24"
                       value={tune}
                       onChange={e => {
                           setTune(parseFloat(e.target.value))
                       }}
                />
                <output id="output" htmlFor="tune">{tune}</output>
            </div>
            <div className="form-group">
                <label htmlFor="detune"
                       onClick={() => {
                           setDetune(0);
                       }}>
                    Detune
                </label>
                <input className="input-block"
                       type="range"
                       name="detune"
                       id="detune"
                       min="-100"
                       max="100"
                       value={detune}
                       onChange={e => {
                           setDetune(parseFloat(e.target.value))
                       }}
                />
                <output id="output" htmlFor="detune">{detune}</output>
            </div>
        </Node>
    )
}

WaveNode.displayName = 'Wave'
WaveNode.icon = 'fa-wave-square'
WaveNode.category = 'Generators';
WaveNode.inputs = [
    'note'
];
WaveNode.outputs = [
    'audio'
];