import {Node} from "./Node";
import {useNodeSlot} from "./NodeSlot";
import {useEffect} from "react";

export const SpeakerNode = () => {
    const {context} = useNodeSlot();

    useEffect(() => {
    }, [context]);

    return (
        <Node>
            <i className="fas fa-volume-high" onClick={() => {

            }}/>
        </Node>
    );
}
