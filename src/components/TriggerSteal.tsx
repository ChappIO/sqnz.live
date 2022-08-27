import {TriggerEvent, useTrigger} from "../hooks/useTrigger";
import {EventListener} from "../utils/EventEmitter";

export interface Props {
    onTrigger: EventListener<TriggerEvent['trigger']>;
}

export const TriggerSteal = ({onTrigger}: Props) => {
    useTrigger(onTrigger);
    return null;
}
