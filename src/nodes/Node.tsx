import {Component, ReactNode, TouchEvent} from "react";
import './Node.scss';
import {NodeContext} from "./NodeContext";

export interface NodeProps {
    children?: ReactNode | undefined;
    id?: string;
    initialX?: number;
    initialY?: number;
    fixedX?: number;
    fixedY?: number;
    audioFrom?: string;
    onTap?: () => void;
}

export interface NodeState {
    posX: number;
    posY: number;
}

function getNodeIdForElement(element: HTMLElement | undefined | null): string | undefined {
    if (!element) {
        return undefined;
    }
    if (element.dataset.nodeid) {
        return element.dataset.nodeid;
    }
    if (element.parentElement) {

    }
    return getNodeIdForElement(element.parentElement);
}

export abstract class Node<P extends NodeProps = NodeProps, S extends NodeState = NodeState> extends Component<P, S> {
    static contextType = NodeContext;

    public constructor(props: P, state: Partial<S>) {
        super(props);
        this.state = {
            posX: window.innerWidth / 2,
            posY: window.innerHeight / 2,
            ...JSON.parse(localStorage.getItem(`node.${props.id}`) || '{}'),
            ...state,
        };

        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchConnect = this.onTouchConnect.bind(this);
    }

    static getDerivedStateFromProps(props: NodeProps) {
        const state: Partial<NodeState> = {};
        if (props.fixedY) {
            state.posY = props.fixedY;
        }
        if (props.fixedX) {
            state.posX = props.fixedX;
        }
        return state;
    }

    abstract renderNode(): ReactNode | undefined;

    public render() {
        return (
            <button className="Node"
                    data-nodeid={this.props.id}
                    onTouchStartCapture={this.onTouchStart}
                    onTouchMoveCapture={this.onTouchMove}
                    onTouchEndCapture={this.onTouchEnd}
                // @ts-ignore
                    onClick={this.onTap}
                    style={{
                        transform: `translate(${this.state.posX}px, ${this.state.posY}px)`
                    }}
            >
                {this.renderNode()}
            </button>
        );
    }

    protected save() {
        const stateCopy = {...this.state};
        for (let stateKey in stateCopy) {
            // @ts-ignore
            if (stateKey in this.context) {
                // @ts-ignore
                delete stateCopy[stateKey];
            }
        }
        localStorage.setItem(`node.${this.props.id}`, JSON.stringify(stateCopy));
    }

    protected onTouchStart(e: TouchEvent) {
        e.stopPropagation();
        if (e.touches.length === 2) {
            this.onTouchConnect(e);
        }
    }

    protected onTouchEnd(e: TouchEvent) {
        e.stopPropagation();
        this.save();
    }

    private onTouchConnect(e: TouchEvent) {
        const to = getNodeIdForElement(e.touches[1].target as HTMLElement);
        if (to !== this.props.id) {
            return;
        }
        const from = getNodeIdForElement(e.touches[0].target as HTMLElement);
        if (!from) {
            return;
        }
        // connecting nodes??
        console.debug(`Connect: ${from} -> ${to}`);
    }

    private onTouchMove(e: TouchEvent) {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            this.setState({
                posX: touch.pageX - e.currentTarget.clientWidth / 2,
                posY: touch.pageY - e.currentTarget.clientHeight / 2
            })
        }
    }
}
