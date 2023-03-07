import {useEffect, useRef} from "react";

const NO_INIT = Symbol('No Value Initialized');

export function useSingleton<T>(creator: () => T): T
export function useSingleton<T>(creator: () => T, effect: (thing: T) => void, dependencies: any[]): T
export function useSingleton<T>(creator: () => T, effect?: (thing: T) => void, dependencies?: any[]): T {
    const ref = useRef<T | typeof NO_INIT>(NO_INIT);

    if (ref.current === NO_INIT) {
        ref.current = creator();
    }
    const current = ref.current;

    useEffect(() => {
        if (effect) {
            effect(current);
        }
    }, [current, effect, ...(dependencies || [])]);

    return ref.current;
}