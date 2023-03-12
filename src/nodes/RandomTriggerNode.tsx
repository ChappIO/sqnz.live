import {CustomNode, Node, NodeProps} from "./Node";
import {useEffect, useRef} from "react";
import './ThereminNode.scss';
import {useGetTriggerNode} from "../hooks/useTriggerNodeRegister";
import {useDeepMemo} from "../hooks/useDeepMemo";
import {usePersistedState} from "../hooks/usePersistedState";
import {useProject} from "../hooks/useProject";
import {Scale} from "tonal";

const scales = [
    'chromatic',
    ...Scale.names().filter(s => s !== 'chromatic')
];

export const RandomTriggerNode: CustomNode = ({...nodeProps}: NodeProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const destinations = useDeepMemo(nodeProps.outputs.filter(o => o.type === 'note').map(o => o.to));
    const getTriggerNode = useGetTriggerNode();
    const project = useProject();
    const [scale, setScale] = usePersistedState('scale', scales[0], {
        namespace: `${project.namespace}/nodes/${nodeProps.id}`
    });
    const [tempo, setTempo] = usePersistedState('tempo', 120, {
        namespace: `${project.namespace}/nodes/${nodeProps.id}`
    });
    const [steps, setSteps] = usePersistedState('steps', 4, {
        namespace: `${project.namespace}/nodes/${nodeProps.id}`
    });
    const [chance, setChance] = usePersistedState('chance', 100, {
        namespace: `${project.namespace}/nodes/${nodeProps.id}`
    });

    const interval = 60000 / tempo / steps;

    useEffect(() => {
        const timer = setInterval(() => {
            if(Math.random() * 100 > chance) {
                return;
            }
            const notesInScale = Scale.get("C4 " + scale).notes;
            const randomNote = notesInScale[Math.floor(Math.random() * notesInScale.length)];
            for (let destination of destinations) {
                const trigger = getTriggerNode(destination)?.fire(
                    undefined,
                    randomNote
                );

                setTimeout(() => {
                    trigger?.stop();
                }, 100);
            }
        }, interval);

        return () => clearInterval(timer);
    }, [destinations, interval, getTriggerNode, scale, chance]);


    return (
        <Node {...nodeProps} node={RandomTriggerNode}>
            <div className="play-zone"
                 ref={ref}
            >
                <div className="form-group">
                    <label htmlFor="scale" onClick={() => {
                        setScale('chromatic');
                    }}>Scale</label>
                    <select id="scale" value={scale} onChange={(e) => setScale(e.target.value as any)}>
                        {Object.values(scales).map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="tempo"
                           onClick={() => {
                               setTempo(120);
                           }}>
                        Tempo
                    </label>
                    <input className="input-block"
                           type="range"
                           name="tempo"
                           id="tempo"
                           min="10"
                           max="500"
                           value={tempo}
                           onChange={e => {
                               setTempo(parseInt(e.target.value))
                           }}
                    />
                    <output id="output" htmlFor="tempo">{tempo} bpm</output>
                </div>
                <div className="form-group">
                    <label htmlFor="steps"
                           onClick={() => {
                               setSteps(4);
                           }}>
                        Steps
                    </label>
                    <input className="input-block"
                           type="range"
                           name="steps"
                           id="steps"
                           min="1"
                           max="8"
                           value={steps}
                           onChange={e => {
                               setSteps(parseInt(e.target.value))
                           }}
                    />
                    <output id="output" htmlFor="steps">{steps} spb</output>
                </div>
                <div className="form-group">
                    <label htmlFor="chance"
                           onClick={() => {
                               setChance(100);
                           }}>
                        Chance
                    </label>
                    <input className="input-block"
                           type="range"
                           name="chance"
                           id="chance"
                           min="0"
                           max="100"
                           value={chance}
                           onChange={e => {
                               setChance(parseInt(e.target.value))
                           }}
                    />
                    <output id="output" htmlFor="chance">{chance}%</output>
                </div>
            </div>
        </Node>
    )
}

RandomTriggerNode.displayName = 'Random';
RandomTriggerNode.category = 'Triggers';
RandomTriggerNode.outputs = ['note'];
RandomTriggerNode.icon = 'fa-dice';
