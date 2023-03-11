import {Node} from "./Node";

export const NewNode = () => {
    return (
        <Node onTap={() => {
            alert('New Node!');
        }}>
            <i className="fas fa-plus"/>
        </Node>
    );
}
