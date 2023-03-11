import './SketchPage.scss';
import {Fragment, ReactElement, useState} from "react";
import {SpeakerNode} from "../nodes/SpeakerNode";
import {NodeSlot, Props as NodeSlotProps} from "../nodes/NodeSlot";
import {useAudioContext} from "../hooks/useAudioContext";
import {NewNode} from "../nodes/NewNode";
import {WaveNode} from "../nodes/WaveNode";

export const SketchPage = () => {
    const context = useAudioContext();

    const [nodes, setNodes] = useState<ReactElement<NodeSlotProps>[]>([
        <NodeSlot id="speaker" posX={window.innerWidth - 70} posY={10}>
            <SpeakerNode/>
        </NodeSlot>,
        <NodeSlot id="test" posX={100} posY={10}>
            <WaveNode/>
        </NodeSlot>,
        <NodeSlot id="new" posX={10} posY={10}>
            <NewNode/>
        </NodeSlot>,
    ]);

    return (
        <div className="SketchPage">
            <div className="Backdrop">
                SQNZ<sub>.live</sub>
            </div>
            {
                nodes.map((node) => (
                    <Fragment key={node.props.id}>
                        {node}
                    </Fragment>
                ))
            }
        </div>
    )
}