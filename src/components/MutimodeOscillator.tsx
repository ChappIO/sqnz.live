import {Oscillator} from "./Oscillator";
import {useState} from "react";
import {Knob} from "./Knob";

const modes: [string, OscillatorType][] = [
    ['sine', 'sine'],
    ['tri', 'triangle'],
    ['sqr', 'square'],
    ['saw', 'sawtooth'],
]


export const MultimodeOscillator = () => {
    const [select, setSelect] = useState(0);

    const [label, type] = modes[select];
    return (
        <>
            <Oscillator type={type}/>
            <Knob label={`${label} wave`} min={0} max={modes.length - 1} value={select} defaultValue={0} onChange={setSelect}/>
        </>
    )
}
