import {PropsWithChildren} from "react";
import {TriggerButton} from "./TriggerButton";
import {Oscillator} from "./Oscillator";
import {Amplifier} from "./Amplifier";
import {Gate} from "./Gate";

export const Instrument = ({children}: PropsWithChildren) => {
    return (
        <div className="instrument">
            <Amplifier max={115}>
                <TriggerButton>
                    <Gate time={500}>
                        <Oscillator/>
                    </Gate>
                </TriggerButton>
            </Amplifier>
        </div>
    );
}
