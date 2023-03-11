import './Node.scss';
import {PropsWithChildren} from "react";
import {useNodeSlot} from "./NodeSlot";


export interface Props {
    onTap?: () => void;
}

export const Node = ({children, onTap}: PropsWithChildren<Props>) => {
    const {posX, posY} = useNodeSlot();

    return (
        <button className="Node" style={{
            left: posX,
            top: posY
        }} onClick={onTap}>
            {children}
        </button>
    )
}