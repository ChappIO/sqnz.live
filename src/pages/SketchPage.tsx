import './SketchPage.scss';
import {ReactElement, useState} from "react";
import {SpeakerNode} from "../nodes/SpeakerNode";
import {AddNewNodeNode} from "../nodes/AddNewNodeNode";
import {WaveNode} from "../nodes/WaveNode";
import {uuid} from "../utils/uuid";

export const SketchPage = () => {
    const [nodes, setNodes] = useState<ReactElement[]>([
        <SpeakerNode key="speaker" id="speaker" initialX={window.innerWidth - 70} initialY={12}/>,
        <AddNewNodeNode id="new" key="new" fixedX={10} fixedY={10} onTap={() => {
            const id = uuid();
            setNodes(prev => [...prev, <WaveNode id={id} key={id}/>]);
        }}/>
    ]);

    return (
        <div className="SketchPage">
            <div className="Backdrop">
                SQNZ<sub>.live</sub>
            </div>
            {nodes}
        </div>
    )
}
