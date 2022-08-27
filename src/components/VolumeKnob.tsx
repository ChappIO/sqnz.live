import {Knob} from "./Knob";
import {Amplifier} from "./Amplifier";
import {PropsWithChildren, useState} from "react";

export interface Props {
    label: string;
    defaultValue: number;
    max: number;
}

export const VolumeKnob = ({label, defaultValue, max, children}: PropsWithChildren<Props>) => {
    const [volume, setVolume] = useState(() => defaultValue)

    return (
        <Amplifier volumePercent={volume}>
            {children}
            <Knob label={`${volume} % ${label}`} min={0} max={max} value={volume} defaultValue={defaultValue}
                  onChange={setVolume}/>
        </Amplifier>
    )
};
