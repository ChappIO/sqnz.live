import {CustomNode, Node, NodeProps} from "./Node";
import {Touch, TouchEvent, useRef} from "react";
import './ThereminNode.scss';
import {Interval, Note} from "tonal";
import {useGetTriggerNode} from "../hooks/useTriggerNodeRegister";

const numberOfSemitones = 14;

export const ThereminNode: CustomNode = ({...nodeProps}: NodeProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const destinations = nodeProps.outputs.filter(o => o.type === 'note').map(o => o.to);
    const getTriggerNode = useGetTriggerNode();


    function parseTouch(touch: Touch) {
        const playZoneBox = ref.current?.getBoundingClientRect();
        if (!playZoneBox) {
            return undefined;
        }
        const diagonal = Math.sqrt(playZoneBox.width * playZoneBox.width + playZoneBox.height * playZoneBox.height);
        const touchX = touch.pageX - playZoneBox?.left;
        const touchY = playZoneBox?.bottom - touch.pageY;
        const distance = Math.sqrt(touchX * touchX + touchY * touchY);
        const relativeDistance = distance / diagonal;
        const inSemiTones = relativeDistance * numberOfSemitones;
        const closestSemi = Math.round(inSemiTones);
        const note = Note.transpose('C4', Interval.fromSemitones(closestSemi));

        return {
            identifier: touch.identifier,
            note,
            inSemiTones,
        }
    }


    function onTouchStart(e: TouchEvent) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = parseTouch(e.changedTouches.item(i));
            if (!touch) {
                continue;
            }

            console.log('start', touch.identifier);
            for (let destination of destinations) {
                getTriggerNode(destination)?.fire(
                    touch.identifier,
                    touch.note,
                    {
                        triggeredTone: touch.inSemiTones
                    }
                )
            }
        }
    }

    function onTouchMove(e: TouchEvent) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = parseTouch(e.changedTouches.item(i));
            if (!touch) {
                continue;
            }

            for (let destination of destinations) {
                const note = getTriggerNode(destination)?.get(touch.identifier);
                if (!note) {
                    continue;
                }
                note.detune = touch.inSemiTones - note?.details?.triggeredTone;
            }
        }
    }


    function onTouchEnd(e: TouchEvent) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches.item(i);
            console.log('stop', touch.identifier);
            for (let destination of destinations) {
                getTriggerNode(destination)?.get(touch.identifier)?.stop();
            }
        }
    }

    return (
        <Node {...nodeProps} node={ThereminNode}>
            <div className="play-zone"
                 ref={ref}
                 onTouchStartCapture={onTouchStart}
                 onTouchMoveCapture={onTouchMove}
                 onTouchEndCapture={onTouchEnd}
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
