import {ReactElement, useCallback, useEffect, useState} from "react";
import {Amplifier} from "./audio/Amplifier";
import {Knob} from "./Knob";
import {SequenceTrigger} from "../triggers/SequenceTrigger";
import {useTrigger} from "../hooks/useTrigger";
import {useKey} from "../hooks/useKeyDown";


const StealGate = ({onGate}: { onGate: (state: boolean) => void }) => {
    const trigger = useTrigger();
    useEffect(() => {
        return trigger.unsubscribe(
            trigger.addEventListener('gateOpen', () => onGate(true)),
            trigger.addEventListener('gateClose', () => onGate(false)),
        );
    }, [trigger, onGate]);
    return null;
}

export interface Props {
    name: string;
    macroControls: ReactElement;
    settings: ReactElement;
    audioEngine: ReactElement;
}

export const Instrument = ({name, macroControls, settings, audioEngine}: Props) => {
    const [trigger, setTrigger] = useState(false);
    const [volume, setVolume] = useState(100);
    const [isEdit, setEdit] = useState(false);

    useKey('keydown', 'Escape', () => setEdit(false));

    return (
        <div className="instrument">
            <div className={`macro-controls ${trigger ? 'trigger' : ''}`}>
                <div className="header">
                    <h2>{name}</h2>
                    <button onClick={() => {
                        setEdit(true);
                    }}>Edit</button>
                </div>
                <div className="controls">
                    {macroControls}
                    <Knob label={`${volume} %`} min={0} max={115} value={volume} defaultValue={100} onChange={setVolume}/>
                </div>
            </div>
            <Amplifier volume={volume}>
                <SequenceTrigger>
                    <StealGate onGate={setTrigger}/>
                    {audioEngine}
                </SequenceTrigger>
            </Amplifier>
            {isEdit && (
                <div className="instrument-config" onClick={(e) => {
                    if(e.target === e.currentTarget) {
                        setEdit(false);
                    }
                }}>
                    <h2>{name}</h2>
                    <div className="config-panel">
                        {settings}
                    </div>
                </div>
            )}
        </div>
    );
}
