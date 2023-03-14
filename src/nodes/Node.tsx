import {FC, PropsWithChildren, ReactElement, TouchEvent, useState} from "react";
import './Node.scss';
import {usePersistedState} from "../hooks/usePersistedState";
import {useProject} from "../hooks/useProject";
import {Modal} from "../components/Modal";

export type ConnectionType = 'audio' | 'note';

export interface SpecificNodeProps {
    modalActions?: ReactElement
    node: CustomNode;
}

export interface NodeProps {
    id: string;
    initialX?: number;
    initialY?: number;
    fixedX?: number;
    fixedY?: number;
    onTap?: () => void;
    onConnect?: (e: { from: string, to: string }) => void;
    onMoved?: () => void;
    inputs: {
        type: ConnectionType,
        from: string,
    }[];
    outputs: {
        type: ConnectionType,
        to: string,
    }[];
    onDelete?: (id: string) => void;
}

function findNodeId(element: HTMLElement | null | undefined): string | undefined {
    if (!element) {
        return undefined;
    }
    return element.dataset.nodeid || findNodeId(element.parentElement);
}

export type CustomNode = FC<NodeProps> & {
    inputs?: ConnectionType[];
    outputs?: ConnectionType[];
    icon?: string;
    category?: 'Generators' | 'Effects' | 'Triggers';
}

export const Node = ({
                         id,
                         fixedX,
                         fixedY,
                         initialX,
                         initialY,
                         onTap,
                         onConnect,
                         onMoved,
                         onDelete,
                         children,
                         modalActions,
                         inputs,
                         outputs,
                         node,
                     }: PropsWithChildren<NodeProps & SpecificNodeProps>) => {
    const project = useProject();
    const [posX, setPosX] = usePersistedState('posX', fixedX || initialX || window.innerWidth / 2, {
        namespace: `${project.namespace}/nodes/${id}`,
        debounce: 1000,
    });
    const [posY, setPosY] = usePersistedState('posY', fixedY || initialY || window.innerHeight / 2, {
        namespace: `${project.namespace}/nodes/${id}`,
        debounce: 1000,
    });
    const [showDetails, setShowDetails] = useState(false);

    function onTouchStart(e: TouchEvent) {
        if (e.touches.length === 2) {
            // this may be a node connection
            const from = findNodeId(e.touches[0].target as HTMLElement);
            const to = findNodeId(e.touches[1].target as HTMLElement);
            if (to === id && from) {
                if (onConnect) {
                    onConnect({from, to});
                }
            }
        }
    }

    function onTouchMove(e: TouchEvent) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const target = e.currentTarget as HTMLElement;
            setPosX(touch.pageX - target.clientWidth / 2);
            setPosY(touch.pageY - target.clientHeight / 2);
        }
    }

    function onTouchEnd() {
        if (onMoved) {
            onMoved();
        }
    }

    const x = fixedX === undefined ? posX : fixedX;
    const y = fixedY === undefined ? posY : fixedY;

    return (
        <>
            {showDetails && (
                <Modal className={node.displayName}
                       title={<><i className={`fas ${node.icon}`}/> {node.displayName}</>}
                       onClose={() => setShowDetails(false)}>
                    {children}

                    <div className="buttons">
                        {modalActions || <div/>}
                        {onDelete && (
                            <button className="btn-danger" onClick={() => onDelete(id)}><i
                                className="fas fa-bomb"/> Delete
                            </button>
                        )}
                    </div>
                </Modal>
            )}
            <button data-nodeid={id}
                    id={id}
                    className="Node"
                    style={{
                        transform: `translate(${x}px, ${y}px)`
                    }}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                    onClick={() => {
                        if (onTap) {
                            onTap();
                            return;
                        }
                        setShowDetails(true);
                    }}
            >
                <i className={`fas ${node.icon}`}/>
            </button>
        </>
    );
}
