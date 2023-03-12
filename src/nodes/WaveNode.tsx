import {Node, NodeProps} from "./Node";
import {useAudioContext} from "../hooks/useAudioContext";
import {useGetAudioNode} from "../hooks/useAudioNodeRegister";
import {usePersistedState} from "../hooks/usePersistedState";
import {useProject} from "../hooks/useProject";

export interface Props extends NodeProps {

}

export const WaveNode = ({onTap, ...nodeProps}: NodeProps) => {
    const project = useProject();
    const [waveform, setWaveform] = usePersistedState<OscillatorType>('waveform', 'sine', {
        namespace: `${project.namespace}/nodes/${nodeProps.id}`
    });
    const destinations = nodeProps.outputs.filter(o => o.type === 'audio').map(o => o.to);
    const getAudioNode = useGetAudioNode();
    const context = useAudioContext();

    function playNote() {
        if (onTap) {
            onTap();
        }
        const gain = context.createGain();
        destinations.forEach(key => {
            const destination = getAudioNode(key);
            if (destination) {
                gain.connect(destination);
            }
        });
        const osc = context.createOscillator();
        osc.type = waveform;
        osc.connect(gain);
        osc.start();

        setTimeout(() => {
            gain.gain.setTargetAtTime(0, context.currentTime, 0.01);
        }, 500);
    }

    return (
        <Node {...nodeProps}
              icon="fa-wave-square"
              name="Wave"
              modalActions={<>
                  <button className="btn-success" onClick={playNote}>
                      Test <i className="fas fa-play"/>
                  </button>
              </>}
        >
            <div className="form-group">
                <label htmlFor="waveform">Waveform</label>
                <select id="waveform" value={waveform} onChange={(e) => setWaveform(e.target.value as any)}>
                    <option value="sine">Sine</option>
                    <option value="triangle">Triangle</option>
                    <option value="square">Square</option>
                    <option value="sawtooth">Saw</option>
                </select>
            </div>
        </Node>
    )
}