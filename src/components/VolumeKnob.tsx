import {Knob, Props as KnobProps} from "./Knob";

export type Props = Omit<KnobProps, 'defaultValue' | 'label' | 'min' | 'max'> & { max?: number };

export const VolumeKnob = (props: Props) => <Knob label={`${props.value} %`} defaultValue={100} min={0} max={100} {...props} />
