import {PropsWithChildren, useCallback, useState} from "react";
import {VolumeKnob} from "./VolumeKnob";
import {Props as SequenceProps, TriggerSequence} from './TriggerSequence';
import {TriggerSteal} from "./TriggerSteal";

export type Props = SequenceProps;

export const Instrument = ({children, ...sequenceProps}: PropsWithChildren<Props>) => {
    const [trigger, setTrigger] = useState(false);
    const handleTrigger = useCallback(
        () => {
            setTrigger(true);
            setTimeout(() => setTrigger(false), 10);
        },
        []
    )
    return (
        <div className={`instrument ${trigger ? 'trigger' : ''}`}>
            <VolumeKnob defaultValue={100} max={115} label="vol">
                <TriggerSequence {...sequenceProps}>
                    {children}
                    <TriggerSteal onTrigger={handleTrigger}/>
                </TriggerSequence>
            </VolumeKnob>
        </div>
    );
}
