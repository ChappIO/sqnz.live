import {CustomNode, Node, NodeProps} from "./Node";
import {TouchEvent, useRef} from "react";
import './ThereminNode.scss';
import {Interval, Note} from "tonal";

const numberOfSemitones = 13;

export const ThereminNode: CustomNode = ({...nodeProps}: NodeProps) => {
    const ref = useRef<HTMLDivElement | null>(null);

    function onTouchStart(e: TouchEvent) {
        const playZoneBox = ref.current?.getBoundingClientRect();
        if (!playZoneBox) {
            return;
        }
        const diagonal = Math.sqrt(playZoneBox.width * playZoneBox.width + playZoneBox.height * playZoneBox.height);
        for (let i = 0; i < e.targetTouches.length; i++) {
            const touch = e.targetTouches.item(i);
            const touchX = touch.pageX - playZoneBox?.left;
            const touchY = playZoneBox?.bottom - touch.pageY;
            const distance = Math.sqrt(touchX * touchX + touchY * touchY);
            const relativeDistance = distance / diagonal;
            const inSemiTones = relativeDistance * numberOfSemitones;
            const closestSemi = Math.round(inSemiTones);
            console.log({
                inSemiTones,
                closestSemi,
            });
        }
    }

    return (
        <Node {...nodeProps} node={ThereminNode}>
            <div className="play-zone"
                 ref={ref}
                 onTouchStartCapture={onTouchStart}
            >
                {
                    new Array(numberOfSemitones).fill(null).map((_, offset) => {
                        const note = Note.get(Note.transpose('C4', Interval.fromSemitones(offset)));
                        return (
                            <div key={offset} className={`circle ${note.acc ? 'black' : 'white'}`}>
                            </div>
                        )
                    })
                }
            </div>
        </Node>
    )
}

ThereminNode.displayName = 'Theremin';
ThereminNode.category = 'Triggers';
ThereminNode.outputs = ['note'];
ThereminNode.icon = 'fa-hand-spock';
