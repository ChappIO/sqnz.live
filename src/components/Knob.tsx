import {useEffect, useRef, useState} from "react";
import {useRateLimit} from "../hooks/useRateLimit";

export interface Props {
    label: string;
    min: number;
    max: number;
    value: number;
    defaultValue: number;
    onChange: (newValue: number) => void;
}

const distanceToFullRotation = 200;

export const Knob = ({label, onChange, value, max, min, defaultValue}: Props) => {
    const [lastOffset, setLastOffset] = useState<number>(0)
    const [actualValue, setActualValue] = useState<number>(value);
    const handle = useRef<HTMLDivElement | null>(null);
    const ghost = useRef<Element | null>(null);
    const knob = useRef<HTMLDivElement | null>(null);
    const range = max - min;
    const rangePerPercent = (range) / 100;
    const percent = (actualValue - min) / rangePerPercent;
    const rotationDeg = Math.round(percent * 360 / 100);
    const handleChange = useRateLimit(100, onChange);

    useEffect(() => {
        const rounded = Math.round(actualValue);
        if (value !== rounded) {
            handleChange(rounded)
        }
    }, [actualValue, value, handleChange]);
    return (
        <div className="knob" ref={knob}>
            <div className="handle" ref={handle}
                 draggable
                 data-min={min}
                 data-max={max}
                 data-value={value}
                 data-percent={percent}
                 data-rotate={rotationDeg}
                 onDoubleClick={() => {
                     setActualValue(defaultValue);
                 }}
                 onDragStart={(e) => {
                     setLastOffset(0);
                     ghost.current = handle.current!.cloneNode(true) as Element;
                     ghost.current.classList.add('dragging-ghost');
                     knob.current!.appendChild(ghost.current);
                     e.dataTransfer.setDragImage(ghost.current, 0, 0);
                 }}
                 onDragEnd={() => {
                     setLastOffset(0);
                     knob.current!.removeChild(ghost.current!);
                     ghost.current = null;
                 }}
                 onDragCapture={(e) => {
                     if (e.pageY === 0 && e.pageX === 0) {
                         // Fix: Chrome bug which fires a drag event on end
                         return;
                     }
                     const offset = e.nativeEvent.offsetX - e.nativeEvent.offsetY;
                     if (offset !== lastOffset) {
                         const delta = (offset - lastOffset) / distanceToFullRotation;
                         setActualValue(Math.min(
                             Math.max(
                                 delta * range + actualValue,
                                 min
                             ),
                             max
                         ));
                         setLastOffset(offset);
                     }
                 }}>
                <div className="pointer"/>
            </div>
            <span className="label">{label}</span>
        </div>
    )
}
