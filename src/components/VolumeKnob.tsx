import {Knob, Props as KnobProps} from "./Knob";

export type Props = Omit<KnobProps, 'defaultValue' | 'min' | 'max'> & { max?: number, defaultValue?: number };

export const VolumeKnob = (props: Props) => <Knob  defaultValue={100} min={0} max={100} {...props} label={`${props.value} % ${props.label}`} />
