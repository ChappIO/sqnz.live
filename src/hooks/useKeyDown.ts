import {useEffect} from "react";


export const useKey = (direction: 'keyup' | 'keydown', key: string, trigger: () => void) => {
    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.repeat) {
                return false;
            }
            if (e.key === key) {
                e.preventDefault();
                trigger();
            }
        }
        document.addEventListener(direction, listener);
        return () => document.removeEventListener(direction, listener);
    }, [trigger, direction, key]);
}
