import {Gate} from "./Gate";
import {Oscillator} from "./Oscillator";
import {Tone} from "../music/Note";
import {VolumeKnob} from "./VolumeKnob";
import {TriggerSequence} from "./TriggerSequence";
import {useSingleton} from "../hooks/useSingleton";


export const Metronome = () => (
    <VolumeKnob label="beep" defaultValue={0} max={100}>
        <TriggerSequence notes={useSingleton(() => [
            {
                tone: Tone.C5,
                gate: 50
            }
        ])}
                         interval={4}>
            <Gate>
                <Oscillator type="triangle"/>
            </Gate>
        </TriggerSequence>
    </VolumeKnob>
)
