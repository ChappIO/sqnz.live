import {PropsWithChildren, useState} from "react";
import {Knob} from "./Knob";
import {Reverb, ReverbTypes} from "./Reverb";


const types = Object.keys(ReverbTypes) as (keyof typeof ReverbTypes)[];

export const ReverbKnob = ({children}: PropsWithChildren) => {
    const [select, setSelect] = useState(0);

    const type = types[select];

    return (
        <>
            <Reverb preset={type}>
                {children}
            </Reverb>
            <Knob label={`${type} revb`} min={0} max={types.length - 1} value={select} defaultValue={0}
                  onChange={setSelect}/>
        </>
    )
}
