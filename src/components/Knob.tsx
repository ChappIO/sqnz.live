import {useRef, useState} from "react";

export interface Props {
    label: string;
    min: number;
    max: number;
    value: number;
    defaultValue: number;
    onChange: (newValue: number) => void;
}

export const Knob = ({label, onChange, value, max, min, defaultValue}: Props) => {
    const [lastOffset, setLastOffset] = useState<number>(0)
    const handle = useRef<HTMLDivElement | null>(null);
    const ghost = useRef<Element | null>(null);
    const knob = useRef<HTMLDivElement | null>(null);
    const rangePerPercent = (max - min) / 100;
    const percent = min + (value / rangePerPercent);
    const rotationDeg = Math.round(percent * 360 / 100);
    return (
        <div className="knob" ref={knob}>
            <div className="handle" ref={handle}
                 draggable
                 data-rotate={rotationDeg}
                 onDoubleClick={() => {
                     onChange(defaultValue);
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
                 onDrag={(e) => {
                     const offset = e.nativeEvent.offsetX - e.nativeEvent.offsetY;
                     if (offset !== lastOffset) {
                         const delta = offset - lastOffset;
                         const newValue = Math.round(delta * rangePerPercent / 2 + value);
                         if (newValue !== value) {
                             onChange(
                                 Math.min(
                                     Math.max(
                                         newValue,
                                         min
                                     ),
                                     max
                                 )
                             );
                         }
                         setLastOffset(offset);
                     }
                 }}>
                <div className="pointer"/>
            </div>
            <span className="label">{label}</span>
        </div>
    )
}
