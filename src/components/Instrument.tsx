import {ReactElement, useEffect, useState} from "react";
import {Amplifier} from "./audio/Amplifier";
import {Knob} from "./Knob";
import {Sequencer, Step} from "./audio/Sequencer";
import {useKey} from "../hooks/useKeyDown";
import {SequenceEditor} from "./SequenceEditor";

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
    const [isEditSequence, setEditSequence] = useState(false);
    const [steps, setSteps] = useState<Step[]>(() => Array(16).fill(null));
    const [activeStep, setActiveStep] = useState(0);

    useEffect(() => {
        if (steps[activeStep]) {
            setTrigger(true);
            setTimeout(() => setTrigger(false), 10);
        }
    }, [activeStep, steps]);

    useKey('keydown', 'Escape', () => {
        setEdit(false);
        setEditSequence(false);
    });

    return (
        <div className="instrument">
            <div className={`macro-controls ${trigger ? 'trigger' : ''}`}>
                <div className="header">
                    <h2>{name}</h2>
                </div>
                <div className="controls">
                    {macroControls}
                    <Knob label={`${volume} %`} min={0} max={115} value={volume} defaultValue={100}
                          onChange={setVolume}/>
                    <div className="buttons">
                        <button onClick={() => {
                            setEdit(true);
                        }}>
                            <i className="fas fa-cog"/>
                        </button>
                        <button onClick={() => {
                            setEditSequence(true);
                        }}>
                            <i className="fas fa-grip"/>
                        </button>
                    </div>
                </div>
            </div>
            <Amplifier volume={volume}>
                <Sequencer steps={steps} onChangeActiveStep={setActiveStep}>
                    {audioEngine}
                </Sequencer>
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
            {isEditSequence && (
                <div className="sequencer instrument-config" onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setEditSequence(false);
                    }
                }}>
                    <h2>{name}</h2>
                    <div className="config-panel">
                        <SequenceEditor steps={steps} onChange={setSteps} activeStep={activeStep}
                                        setActiveStep={setActiveStep}/>
                    </div>
                </div>
            )}
        </div>
    );
}
