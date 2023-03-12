import './Modal.scss';
import {PropsWithChildren, ReactElement} from "react";


export interface Props {
    title: string | ReactElement;
    className?: string;
    onClose: () => void;
}

export const Modal = ({title, onClose, children, className}: PropsWithChildren<Props>) => {
    return (
        <div className={`modal active ${className || ''}`}>
            <div className="modal-bg" onClick={onClose}></div>
            <div className="modal-body">
                <span className="btn-close" onClick={onClose}>X</span>
                <h4 className="modal-title">{title}</h4>
                <h5 className="modal-subtitle">{''}</h5>
                {children}
            </div>
        </div>
    );
}