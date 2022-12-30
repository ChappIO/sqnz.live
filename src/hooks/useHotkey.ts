import {useEffect} from "react";

export const useHotkey = (keyCode: string, handler: (e: KeyboardEvent) => void) => {

    useEffect(() => {
        const listener = (e: KeyboardEvent) => {
            if (e.code === keyCode) {
                e.preventDefault();
                handler(e);
            }
        };

        window.addEventListener('keydown', listener);
        return () => window.removeEventListener('keydown', listener);
    }, [handler, keyCode]);
}
