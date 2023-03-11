import {PropsWithChildren, TouchEvent} from "react";
import './Node.scss';
import {usePersistedState} from "../hooks/usePersistedState";

export interface NodeProps {
    id: string;
    initialX?: number;
    initialY?: number;
    fixedX?: number;
    fixedY?: number;
    onTap?: () => void;
}

function findNodeId(element: HTMLElement | null | undefined): string | undefined {
    if (!element) {
        return undefined;
    }
    return element.dataset.nodeid || findNodeId(element.parentElement);
}

export const Node = ({id, fixedX, fixedY, initialX, initialY, onTap, children}: PropsWithChildren<NodeProps>) => {
    const [posX, setPosX] = usePersistedState('posX', fixedX || initialX || window.innerWidth / 2, {
        namespace: `nodes/${id}`,
        debounce: 1000,
    });
    const [posY, setPosY] = usePersistedState('posY', fixedY || initialY || window.innerHeight / 2, {
        namespace: `nodes/${id}`,
        debounce: 1000,
    });

    function onTouchStart(e: TouchEvent) {
        e.stopPropagation();
        if (e.touches.length === 2) {
            // this may be a node connection
            const from = findNodeId(e.touches[0].target as HTMLElement);
            const to = findNodeId(e.touches[1].target as HTMLElement);
            if (to === id && from) {
                console.debug(`Connect ${from} -> ${to}`);
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
        }
    }

    const x = fixedX === undefined ? posX : fixedX;
    const y = fixedY === undefined ? posY : fixedY;

    return (
        <button data-nodeid={id}
                className="Node"
                style={{
                    transform: `translate(${x}px, ${y}px)`
                }}
                onTouchStartCapture={onTouchStart}
                onTouchMoveCapture={onTouchMove}
                onTouchEndCapture={onTouchEnd}
                onClick={onTap}
        >
            {children}
        </button>
    );
}

// export abstract class Node<P extends NodeProps = NodeProps, S extends NodeState = NodeState> extends Component<P, S> {
//     static contextType = NodeContext;
//
//     public constructor(props: P, state: Partial<S>) {
//         super(props);
//         this.state = {
//             posX: window.innerWidth / 2,
//             posY: window.innerHeight / 2,
//             ...JSON.parse(localStorage.getItem(`node.${props.id}`) || '{}'),
//             ...state,
//         };
//
//         this.onTouchMove = this.onTouchMove.bind(this);
//         this.onTouchEnd = this.onTouchEnd.bind(this);
//         this.onTouchStart = this.onTouchStart.bind(this);
//         this.onTouchConnect = this.onTouchConnect.bind(this);
//     }
//
//     static getDerivedStateFromProps(props: NodeProps) {
//         const state: Partial<NodeState> = {};
//         if (props.fixedY) {
//             state.posY = props.fixedY;
//         }
//         if (props.fixedX) {
//             state.posX = props.fixedX;
//         }
//         return state;
//     }
//
//     abstract renderNode(): ReactNode | undefined;
//
//     public render() {
//         return (
//             <button className="Node"
//                     data-nodeid={this.props.id}
//                     onTouchStartCapture={this.onTouchStart}
//                     onTouchMoveCapture={this.onTouchMove}
//                     onTouchEndCapture={this.onTouchEnd}
//                 // @ts-ignore
//                     onClick={this.onTap}
//                     style={{
//                         transform: `translate(${this.state.posX}px, ${this.state.posY}px)`
//                     }}
//             >
//                 {this.renderNode()}
//             </button>
//         );
//     }
//
//     protected save() {
//         const stateCopy = {...this.state};
//         for (let stateKey in stateCopy) {
//             // @ts-ignore
//             if (stateKey in this.context) {
//                 // @ts-ignore
//                 delete stateCopy[stateKey];
//             }
//         }
//         localStorage.setItem(`node.${this.props.id}`, JSON.stringify(stateCopy));
//     }
//
//     protected onTouchStart(e: TouchEvent) {
//         e.stopPropagation();
//         if (e.touches.length === 2) {
//             this.onTouchConnect(e);
//         }
//     }
//
//     protected onTouchEnd(e: TouchEvent) {
//         e.stopPropagation();
//         this.save();
//     }
//
//     private onTouchConnect(e: TouchEvent) {
//         const to = getNodeIdForElement(e.touches[1].target as HTMLElement);
//         if (to !== this.props.id) {
//             return;
//         }
//         const from = getNodeIdForElement(e.touches[0].target as HTMLElement);
//         if (!from) {
//             return;
//         }
//         // connecting nodes??
//         console.debug(`Connect: ${from} -> ${to}`);
//     }
//
//     private onTouchMove(e: TouchEvent) {
//         if (e.touches.length === 1) {
//             const touch = e.touches[0];
//             this.setState({
//                 posX: touch.pageX - e.currentTarget.clientWidth / 2,
//                 posY: touch.pageY - e.currentTarget.clientHeight / 2
//             })
//         }
//     }
// }
