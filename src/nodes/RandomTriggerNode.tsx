import {CustomNode, Node, NodeProps} from "./Node";
import {useEffect} from "react";
import './ThereminNode.scss';
import {useGetTriggerNode} from "../hooks/useTriggerNodeRegister";
import {useDeepMemo} from "../hooks/useDeepMemo";
import {usePersistedState} from "../hooks/usePersistedState";
import {useProject} from "../hooks/useProject";
import {Scale} from "tonal";
import {useClock} from "../hooks/useClock";

const scales = [
    'chromatic',
    ...Scale.names().filter(s => s !== 'chromatic')
];

export const RandomTriggerNode: CustomNode = ({...nodeProps}: NodeProps) => {
    const destinations = useDeepMemo(nodeProps.outputs.filter(o => o.type === 'note').map(o => o.to));
    const getTriggerNode = useGetTriggerNode();
    const project = useProject();
    const clock = useClock();
    const [scale, setScale] = usePersistedState('scale', scales[0], {
        namespace: `${project.namespace}/nodes/${nodeProps.id}`
    });
    const [chance, setChance] = usePersistedState('chance', 100, {
        namespace: `${project.namespace}/nodes/${nodeProps.id}`
    });
    const [length, setLength] = usePersistedState('length', 1, {
        namespace: `${project.namespace}/nodes/${nodeProps.id}`
    });

    useEffect(() => {
        return clock.onStep(() => {
            if (Math.random() * 100 > chance) {
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
                }, 60000 / clock.bpm / clock.stepsPerBeat * length / 8);
            }
        });
    }, [destinations, clock, getTriggerNode, scale, chance, length]);


    return (
        <Node {...nodeProps} node={RandomTriggerNode}>
            <div className="modal-content">
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
                    <label htmlFor="length"
                           onClick={() => {
                               setLength(1);
                           }}>
                        Length
                    </label>
                    <input className="input-block"
                           type="range"
                           name="chance"
                           id="length"
                           min="1"
                           max="16"
                           value={length}
                           onChange={e => {
                               setLength(parseInt(e.target.value))
                           }}
                    />
                    <output id="output" htmlFor="length">{length} / 8th step</output>
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
