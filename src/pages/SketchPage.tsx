import './SketchPage.scss';
import {SpeakerNode} from "../nodes/SpeakerNode";
import {AddNewNodeNode} from "../nodes/AddNewNodeNode";
import {ConnectionType, CustomNode, NodeProps} from "../nodes/Node";
import {WaveNode} from "../nodes/WaveNode";
import {useForceUpdate} from "../hooks/useForceUpdate";
import {ReverbNode} from "../nodes/ReverbNode";
import {useProject} from "../hooks/useProject";
import {usePersistedState} from "../hooks/usePersistedState";
import {useEffect, useState} from "react";
import {Modal} from "../components/Modal";
import {uuid} from "../utils/uuid";
import {ThereminNode} from "../nodes/ThereminNode";
import {RandomTriggerNode} from "../nodes/RandomTriggerNode";

const Nodes: { [key: string]: CustomNode } = {
    speaker: SpeakerNode,
    new: AddNewNodeNode,
    theremin: ThereminNode,
    wave: WaveNode,
    reverb: ReverbNode,
    random: RandomTriggerNode,
}

const NodesByCategory = Object.values(Nodes).reduce(
    (grouped: Record<string, CustomNode[]>, node: CustomNode) => {
        if (node.category) {
            (grouped[node.category] = grouped[node.category] || []).push(node);
        }
        return grouped;
    }, {}
);

interface NodeDescription extends Partial<NodeProps> {
    id: string;
    type: keyof typeof Nodes;
}

interface ConnectionDescription {
    id: string;
    from: string;
    to: string;
    type: ConnectionType;
}

export const SketchPage = () => {
    const project = useProject();
    const [nodes, setNodes] = usePersistedState<NodeDescription[]>('nodes', [], {
        namespace: project.namespace
    });
    const [connections, setConnections] = usePersistedState<ConnectionDescription[]>('connections', [], {
        namespace: project.namespace
    });
    const forceUpdate = useForceUpdate();
    const [addNodeModal, setAddNodeModal] = useState(false);

    // Force reload after first pass to generate initial connections
    useEffect(() => {
        forceUpdate();
    }, [forceUpdate]);

    function getNodeById(id: string): NodeDescription | undefined {
        switch (id) {
            case 'master':
                return {
                    id: 'master',
                    type: 'speaker',
                }
            case 'new':
                return {
                    id: 'new',
                    type: 'new'
                }
            default:
                return nodes.find(n => n.id === id);
        }
    }

    function onConnect({from, to}: { from: string, to: string }) {
        console.debug(`Attempted connect ${from} -> ${to}`);
        const fromNode = getNodeById(from);
        const toNode = getNodeById(to);
        if (!fromNode || !toNode) {
            return;
        }
        const fromNodeSettings = Nodes[fromNode.type];
        const toNodeSettings = Nodes[toNode.type];
        const commonTypes = fromNodeSettings.outputs?.filter(value => toNodeSettings.inputs?.includes(value));
        if (!commonTypes?.length) {
            // Nothing to connect
            return;
        }
        console.debug(`Matching types: ${commonTypes}`);

        // TODO: Prompt for connection type?
        const chosenType = commonTypes[0];
        if (!chosenType) {
            return;
        }
        const connection: ConnectionDescription = {
            id: `${chosenType}-${from}-${to}`,
            from,
            to,
            type: chosenType
        }
        // toggle connection
        setConnections(prev => {
            if (prev.some(c => c.id === connection.id)) {
                return prev.filter(c => c.id !== connection.id);
            } else {
                return [...prev, connection];
            }
        });
    }

    function onDelete(nodeId: string) {
        setConnections(prev => prev.filter(con => con.from !== nodeId && con.to !== nodeId));
        setNodes(prev => prev.filter(node => node.id !== nodeId));

        // remove storage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.includes(`nodes/${nodeId}`)) {
                setTimeout(() => {
                    localStorage.removeItem(key);
                }, 1000);
            }
        }
    }

    return (
        <>
            <div className="SketchPage">
                <div className="Backdrop">
                    SQNZ<sub>.live</sub>
                </div>
                <AddNewNodeNode id="new"
                                fixedX={12}
                                fixedY={12}
                                onTap={() => {
                                    setAddNodeModal(true);
                                }}
                                inputs={[]}
                                outputs={[]}
                />
                <SpeakerNode id="master"
                             initialX={window.innerWidth - 70}
                             initialY={12}
                             onConnect={onConnect}
                             inputs={[]}
                             outputs={[]}
                             onMoved={forceUpdate}
                />
                {nodes.map(node => {
                    const Component = Nodes[node.type];
                    const inputs = connections.filter(connection =>
                        connection.to === node.id
                    );
                    const outputs = connections.filter(connection =>
                        connection.from === node.id
                    );
                    return <Component key={node.id}
                                      onConnect={onConnect}
                                      inputs={inputs}
                                      outputs={outputs}
                                      onMoved={forceUpdate}
                                      onDelete={onDelete}
                                      {...node}
                    />
                })}
                <svg className="connections" width={window.innerWidth} height={window.innerHeight}>
                    {
                        connections.map(connection => {
                            const fromNode = document.getElementById(connection.from) as HTMLElement;
                            const toNode = document.getElementById(connection.to) as HTMLElement;
                            if (!toNode || !fromNode) {
                                return null;
                            }
                            const fromRect = fromNode.getBoundingClientRect();
                            const fromSideConnect = {
                                x: fromRect.left + fromRect.width / 2,
                                y: fromRect.top + fromRect.height / 2
                            }
                            const toRect = toNode.getBoundingClientRect();
                            const toSideConnect = {
                                x: toRect.left + toRect.width / 2,
                                y: toRect.top + toRect.height / 2
                            }
                            const droopyness = 100;
                            return <path
                                key={connection.id}
                                d={`M${fromSideConnect.x} ${fromSideConnect.y} C${fromSideConnect.x} ${fromSideConnect.y + droopyness}, ${toSideConnect.x} ${toSideConnect.y + droopyness}, ${toSideConnect.x} ${toSideConnect.y}`}
                                fill="transparent"
                                stroke="black"
                                strokeWidth={2}
                            />
                        })
                    }
                </svg>
            </div>
            {addNodeModal && (
                <Modal title="Add" onClose={() => setAddNodeModal(false)}>
                    <div className="modal-content">
                        {Object.entries(NodesByCategory).map(([category, nodes]) => (
                            <div key={category}>
                                <h5>{category}</h5>
                                <div className="buttons" style={{marginBottom: 12}}>
                                    {nodes.map(node => (
                                        <button key={node.displayName} onClick={() => {
                                            const Node = node;
                                            const id = uuid();
                                            setNodes(prev => [...prev, {
                                                id,
                                                type: Object.entries(Nodes).filter(([, search]) => Node === search)[0][0]
                                            }]);
                                            setAddNodeModal(false);
                                        }}>
                                            <span><i className={`fas ${node.icon}`}/> {node.displayName}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal>
            )}
        </>
    )
}
