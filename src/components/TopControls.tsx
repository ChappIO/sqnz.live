import {TransportControls} from "./TransportControls";
import {AddNodeButton} from "./AddNodeButton";
import './TopControls.scss';

export const TopControls = () => {

    return (
        <div className="TopControls">
            <TransportControls/>
            <div className="Spacer"/>
            <AddNodeButton/>
        </div>
    );
}