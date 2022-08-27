import {BeatTrigger} from "./BeatTrigger";
import {Gate} from "./Gate";
import {Oscillator} from "./Oscillator";


export const Metronome = () => (
    <BeatTrigger>
        <Gate time={50}>
            <Oscillator/>
        </Gate>
    </BeatTrigger>
)
