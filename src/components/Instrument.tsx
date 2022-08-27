import {PropsWithChildren} from "react";
import {Oscillator} from "./Oscillator";
import {Amplifier} from "./Amplifier";
import {Gate} from "./Gate";
import {TriggerButton} from "./TriggerButton";

export const Instrument = ({}: PropsWithChildren) => {
    return (
        <div className="instrument">
            <Amplifier max={115} label="vol">
                <TriggerButton>
                    <Gate time={50}>
                        <Oscillator/>
                    </Gate>
                </TriggerButton>
            </Amplifier>
        </div>
    );
}
