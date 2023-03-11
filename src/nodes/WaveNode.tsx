import {Node} from "./Node";
import {useNodeSlot} from "./NodeSlot";

export const WaveNode = () => {
    const {destination} = useNodeSlot();

    return (
        <Node onTap={() => {
            if (destination) {
                const osc = destination.context.createOscillator();
                osc.connect(destination);
                osc.start();
                setTimeout(() => {
                    osc.stop();
                    osc.disconnect(destination);
                }, 1000);
            }
        }}>
            <i className="fas fa-wave-square"/>
        </Node>
    );
}
