import {useRef} from "react";

const NO_INIT = Symbol('No Value Initialized');

export const useSingleton = <T>(creator: () => T): T => {
    const ref = useRef<T | typeof NO_INIT>(NO_INIT);

    const current = ref.current;
    if (current === NO_INIT) {
        const instance = creator();
        ref.current = instance;
        return instance;
    }
    return current;
}
