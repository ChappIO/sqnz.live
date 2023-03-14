import {CustomNode, Node, NodeProps} from "./Node";
import './ThereminNode.scss';
import {useGetTriggerNode} from "../hooks/useTriggerNodeRegister";
import {useDeepMemo} from "../hooks/useDeepMemo";
import {useProject} from "../hooks/useProject";
import './ProgramTriggerNode.scss';
import {Interval, Note} from "tonal";
import {usePersistedState} from "../hooks/usePersistedState";
import {useEffect, useState} from "react";

const numberOfSemitones = 13;

type Trig = {
    note: ReturnType<(typeof Note)['get']>,
}
type Step = {
    trigs: Trig[]
}

export const ProgramTriggerNode: CustomNode = ({...nodeProps}: NodeProps) => {
    const destinations = useDeepMemo(nodeProps.outputs.filter(o => o.type === 'note').map(o => o.to));
    const getTriggerNode = useGetTriggerNode();
    const project = useProject();
    const [steps, setSteps] = usePersistedState<Step[]>('steps', [
        {
            trigs: []
        }
    ], {
        namespace: `${project.namespace}/nodes/${nodeProps.id}/steps`
    });
    const [activeStep, setActiveStep] = useState(0);

    const length = steps.length;

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStep(prev => (prev + 1) % length);
        }, 150);

        return () => clearInterval(timer);
    }, [length]);

    useEffect(() => {
        const step = steps[activeStep];
        if (!step) {
            return;
        }
        for (let trig of step.trigs.filter(t => !!t)) {
            for (let destination of destinations) {
                const trigger = getTriggerNode(destination)?.fire(
                    undefined,
                    trig.note.name
                );

                setTimeout(() => {
                    trigger?.stop();
                }, 100);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeStep]);

    function setLength(newLength: number) {
        if (newLength > steps.length) {
            // steps need to become bigger!
            setSteps(prev => [
                ...prev,
                ...Array(newLength - prev.length).fill(null).map((): Step => ({
                    trigs: []
                }))
            ]);
        } else {
            // steps need to become smaller
            setSteps(prev => prev.slice(0, newLength));
        }
    }

    return (
        <Node {...nodeProps} node={ProgramTriggerNode}>
            <div className="modal-content">
                <div className="form-group">
                    <label htmlFor="length"
                           onClick={() => {
                               setLength(16);
                           }}>
                        Length
                    </label>
                    <input className="input-block"
                           type="range"
                           name="length"
                           id="length"
                           min="1"
                           max="32"
                           value={length}
                           onChange={e => {
                               setLength(parseInt(e.target.value));
                           }}
                    />
                    <output id="output" htmlFor="length">{length} steps</output>
                </div>
                <div className="piano-roll">
                    {Array(numberOfSemitones).fill(null).map((_, offset) => {
                        const note = Note.get(Note.transpose('C5', Interval.fromSemitones(-offset)));
                        return (
                            <div key={offset} className={`row ${note.acc ? 'black' : 'white'}`} style={{
                                width: (length + 1) * 24
                            }}>
                                <div className="step"/>
                                {
                                    Array(length).fill(null).map((_, stepId) => {
                                        const trig = steps[stepId]?.trigs[offset];
                                        const active = stepId === activeStep;
                                        return (
                                            <div key={stepId}
                                                 className={`step ${trig ? 'trig' : ''} ${active ? 'active' : ''}`}
                                                 onClick={() => {
                                                     console.log({
                                                         stepId,
                                                         offset,
                                                         note: note.name
                                                     })
                                                     setSteps(prev => {
                                                         const copiedSteps = [...prev];

                                                         if (!copiedSteps[stepId]) {
                                                             copiedSteps[stepId] = {
                                                                 trigs: []
                                                             }
                                                         }

                                                         if (!copiedSteps[stepId].trigs[offset]) {
                                                             // enable it
                                                             copiedSteps[stepId].trigs[offset] = {
                                                                 note
                                                             }
                                                         } else {
                                                             // disable it
                                                             delete copiedSteps[stepId].trigs[offset];
                                                         }
                                                         return copiedSteps;
                                                     });
                                                 }}/>
                                        );
                                    })
                                }
                            </div>
                        )
                    })}
                </div>
            </div>
        </Node>
    )
}

ProgramTriggerNode.displayName = 'Program';
ProgramTriggerNode.category = 'Triggers';
ProgramTriggerNode.outputs = ['note'];
ProgramTriggerNode.icon = 'fa-robot';
