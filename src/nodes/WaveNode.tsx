import {Node, NodeProps} from "./Node";
import {useSingleton} from "../hooks/useSingleton";
import {useAudioContext} from "../hooks/useAudioContext";
import {useAudioNode} from "../hooks/useAudioNodeRegister";

export interface Props extends NodeProps {

}

export const WaveNode = ({...nodeProps}: NodeProps) => {
    const destination = useAudioNode(nodeProps.outputs.find(i => i.type === 'audio')?.to);

    const context = useAudioContext();
    useSingleton(() => {
            const osc = context.createOscillator();
            osc.frequency.setValueAtTime(440, context.currentTime);
            osc.start();
            return osc;
        },
        (osc) => {
            if (!destination) {
                osc.disconnect();
            } else {
                osc.connect(destination);
            }
        },
        [destination]
    );

    return (
        <Node {...nodeProps}>
            <i className="fas fa-wave-square"/>
        </Node>
    )
}