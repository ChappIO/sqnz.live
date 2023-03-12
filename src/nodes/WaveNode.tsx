import {Node, NodeProps} from "./Node";
import {useAudioContext} from "../hooks/useAudioContext";
import {useGetAudioNode} from "../hooks/useAudioNodeRegister";

export interface Props extends NodeProps {

}

export const WaveNode = ({onTap, ...nodeProps}: NodeProps) => {
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
        osc.connect(gain);
        osc.start();

        setTimeout(() => {
            gain.gain.setTargetAtTime(0, context.currentTime, 0.01);
        }, 500);
    }

    return (
        <Node {...nodeProps} onTap={playNote} icon="fa-wave-square" name="Wave">
        </Node>
    )
}