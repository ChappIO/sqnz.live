import {useState} from "react";
import {VolumeKnob} from "./VolumeKnob";

export const Instrument = () => {
    const [volume, setVolume] = useState(100);
    return (
        <div className="instrument">
            <VolumeKnob max={115} onChange={setVolume} value={volume}/>
        </div>
    );
}
