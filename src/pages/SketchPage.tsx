import './SketchPage.scss';
import {NodeContext} from "../nodes/NodeContext";
import {ReactElement, useState} from "react";
import {NodeProps} from "../nodes/Node";
import {AddNewNodeNode} from "../nodes/AddNewNodeNode";
import {ShowAllNodes} from "../nodes/ShowAllNodes";
import {SpeakerNode} from "../nodes/SpeakerNode";
import {WaveNode} from "../nodes/WaveNode";
import {uuid} from "../utils/uuid";

export const SketchPage = () => {
    const [nodes, setNodes] = useState<ReactElement<NodeProps>[]>([
        <AddNewNodeNode id="new" fixedY={10} fixedX={10} onAdd={() => {
            setNodes(prev => [...prev,
                <WaveNode id={uuid()}/>
            ])
        }}/>,
        <SpeakerNode id="speaker"/>,
    ]);

    return (
        <div className="SketchPage">
            <div className="Backdrop">
                SQNZ<sub>.live</sub>
            </div>
            <NodeContext.Provider value={{nodes}}>
                <ShowAllNodes/>
            </NodeContext.Provider>
        </div>
    )
}
