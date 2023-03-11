import './SketchPage.scss';
import {DragEvent} from "react";
import {SpeakerNode} from "../nodes/SpeakerNode";
import {AddNewNodeNode} from "../nodes/AddNewNodeNode";

export const SketchPage = () => {

    function onDragOver(e: DragEvent) {
        // make this a valid drop target
        e.preventDefault();
    }

    function onDrop(e: DragEvent) {
        console.log('SketchPage->onDrop', e);
    }

    function onDragStart(e: DragEvent) {
        console.log('SketchPage->onDragStart', e);
    }

    return (
        <div className="SketchPage"
             onDragStart={onDragStart}
             onDragOver={onDragOver}
             onDrop={onDrop}>
            <div className="Backdrop">
                SQNZ<sub>.live</sub>
            </div>
            <AddNewNodeNode id="addNew" fixedX={10} fixedY={10}/>
            <SpeakerNode id="speaker"/>
        </div>
    )
}