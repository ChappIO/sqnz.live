import {PropsWithChildren} from "react";
import {VolumeKnob} from "./VolumeKnob";

export const Instrument = ({children}: PropsWithChildren) => {
    return (
        <div className="instrument">
            <VolumeKnob defaultValue={100} max={115} label="vol">
                {children}
            </VolumeKnob>
        </div>
    );
}
