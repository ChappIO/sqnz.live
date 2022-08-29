import {Step} from "./audio/Sequencer";
import {useTransport} from "../hooks/useTransport";
import {Keyboard} from "./Keyboard";
import {useState} from "react";

export interface Props {
    steps: Step[];
    onChange: (steps: Step[]) => void;
    activeStep: number;
    setActiveStep: (step: number) => void;
}

export const SequenceEditor = ({steps, activeStep, onChange, setActiveStep}: Props) => {
    const transport = useTransport();
    const [selectedStep, selectStep] = useState<number | undefined>();

    function resize(desiredLength: number) {
        if (desiredLength > steps.length) {
            onChange([
                ...steps,
                ...Array(desiredLength - steps.length,).fill(null)
            ]);
        } else if (desiredLength < steps.length) {
            onChange(steps.slice(0, desiredLength));
        }
    }

    return (
        <div className="sequence-editor">
            <div className="steps">
                {steps.map((step, i) => (
                    <div
                        className={`step ${i === activeStep ? 'active' : ''} ${i % transport.pps === 0 ? 'highlight' : ''} ${steps[i] ? 'note' : ''} ${i === selectedStep ? 'selected' : ''}`}
                        onClick={() => {
                            selectStep(i);
                        }}
                        onDoubleClick={() => {
                            resize(i + 1);
                        }}
                        key={i}
                    />
                ))}
            </div>
            <input className="step-selector"
                   type="range"
                   min={1}
                   max={64}
                   value={steps.length}
                   onChange={(e) => {
                       const desiredLength = parseInt(e.target.value);
                       resize(desiredLength);
                   }}
            />
            <Keyboard playingNote={steps[activeStep]?.note}
                      value={(selectedStep !== undefined) ? steps[selectedStep]?.note : undefined} onChange={(note) => {
                const editStep = selectedStep === undefined ? activeStep : selectedStep;

                const copy = [...steps];
                copy.splice(editStep, 1, note ? {
                    note: note,
                    steps: 1
                } : null);
                onChange(copy);
            }}/>
        </div>
    )
}
