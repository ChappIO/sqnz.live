import {PropsWithChildren, TouchEvent} from "react";
import './Node.scss';
import {usePersistedState} from "../hooks/usePersistedState";

export type ConnectionType = 'audio';

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
}

function findNodeId(element: HTMLElement | null | undefined): string | undefined {
    if (!element) {
        return undefined;
    }
    return element.dataset.nodeid || findNodeId(element.parentElement);
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
                         children
                     }: PropsWithChildren<NodeProps>) => {
    const [posX, setPosX] = usePersistedState('posX', fixedX || initialX || window.innerWidth / 2, {
        namespace: `nodes/${id}`,
        debounce: 1000,
    });
    const [posY, setPosY] = usePersistedState('posY', fixedY || initialY || window.innerHeight / 2, {
        namespace: `nodes/${id}`,
        debounce: 1000,
    });

    function onTouchStart(e: TouchEvent) {
        if (onTap) {
            onTap();
        }
        e.stopPropagation();
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

    function onTouchEnd(e: TouchEvent) {
        e.stopPropagation();
    }

    function onTouchMove(e: TouchEvent) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            const target = e.currentTarget as HTMLElement;
            setPosX(touch.pageX - target.clientWidth / 2);
            setPosY(touch.pageY - target.clientHeight / 2);
            if (onMoved) {
                onMoved();
            }
        }
    }

    const x = fixedX === undefined ? posX : fixedX;
    const y = fixedY === undefined ? posY : fixedY;

    return (
        <button data-nodeid={id}
                id={id}
                className="Node"
                style={{
                    transform: `translate(${x}px, ${y}px)`
                }}
                onTouchStart={onTouchStart}
                onTouchMoveCapture={onTouchMove}
                onTouchEndCapture={onTouchEnd}
        >
            {children}
        </button>
    );
}
