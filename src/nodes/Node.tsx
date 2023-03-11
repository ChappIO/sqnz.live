import {Component, DragEvent, ReactNode} from "react";
import './Node.scss';

export interface NodeProps {
    children?: ReactNode | undefined;
    id?: string;
    fixedX?: number;
    fixedY?: number;
}

export interface NodeState {
    posX: number;
    posY: number;
}

export abstract class Node<P extends NodeProps = NodeProps, S extends NodeState = NodeState> extends Component<NodeProps, NodeState> {

    constructor(props: P, state: Partial<S>) {
        super(props);
        this.state = {
            posX: 0,
            posY: 0,
            ...JSON.parse(localStorage.getItem(`node.${props.id}`) || '{}'),
            ...state,
        };

        this.onDragEnd = this.onDragEnd.bind(this);
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
        console.log('hi');
        return (
            <button className="Node"
                    onTouchMove={(e) => {
                        if (e.targetTouches.length === 1) {
                            const touch = e.targetTouches[0];
                            this.setState({
                                posX: touch.clientX - e.currentTarget.clientWidth / 2,
                                posY: touch.clientY - e.currentTarget.clientHeight / 2
                            })
                        }
                    }}
                    onTouchEnd={() => {
                        this.save();
                    }}
                    style={{
                        transform: `translate(${this.state.posX}px, ${this.state.posY}px)`
                    }}
            >
                {this.renderNode()}
            </button>
        );
    }

    protected save() {
        localStorage.setItem(`node.${this.props.id}`, JSON.stringify(this.state));
    }

    private onDragEnd(e: DragEvent) {
        this.setState(prev => ({
            posY: e.pageY,
            posX: e.pageX,
        }))
        console.log({
            posX: this.state.posX,
            posY: this.state.posY,
            pageX: e.pageX,
            pageY: e.pageY,
        });
    }
}
