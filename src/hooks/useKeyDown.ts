import {useEffect} from "react";


export const useKeyDown = (key: string, trigger: () => void) => {
    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.repeat) {
                return false;
            }
            if (e.key === key) {
                trigger();
            }
        }
        document.addEventListener('keydown', listener);
        return () => document.removeEventListener('keydown', listener);
    }, [trigger]);
}
