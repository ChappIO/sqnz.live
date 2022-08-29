import {ReactElement, useCallback, useState} from "react";
import {Amplifier} from "./audio/Amplifier";
import {Knob} from "./Knob";
import {SequenceTrigger} from "../triggers/SequenceTrigger";
import {useKey} from "../hooks/useKeyDown";

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

    const onTrigger = useCallback(() => {
        setTrigger(true);
        setTimeout(() => setTrigger(false), 10);
    }, []);

    useKey('keydown', 'Escape', () => setEdit(false));

    return (
        <div className="instrument">
            <div className={`macro-controls ${trigger ? 'trigger' : ''}`}>
                <div className="header">
                    <h2>{name}</h2>
                    <button onClick={() => {
                        setEdit(true);
                    }}>Edit
                    </button>
                </div>
                <div className="controls">
                    {macroControls}
                    <Knob label={`${volume} %`} min={0} max={115} value={volume} defaultValue={100}
                          onChange={setVolume}/>
                </div>
            </div>
            <Amplifier volume={volume}>
                <SequenceTrigger onTrigger={onTrigger}>
                    {audioEngine}
                </SequenceTrigger>
            </Amplifier>
            {isEdit && (
                <div className="instrument-config" onClick={(e) => {
                    if (e.target === e.currentTarget) {
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
