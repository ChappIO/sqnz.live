import {Fragment, useContext} from "react";
import {NodeContext} from "./NodeContext";

export const ShowAllNodes = () => {
    const context = useContext(NodeContext);

    return (
        <>
            {context.nodes.map((node) => <Fragment key={node.props.id}>{node}</Fragment>)}
        </>
    );
};