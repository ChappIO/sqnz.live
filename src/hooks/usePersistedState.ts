import {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";

export interface Options {
    namespace?: string;
    debounce?: number;
}

function debounced<T extends (...args: any) => any>(cb: T, debounce?: number): T {
    if (!debounce) {
        return cb;
    }
    let timer: any = 0;
    let callable = (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => cb(...args), debounce);
    };
    return callable as T;
}

export const usePersistedState = <T>(key: string, defaultValue: T, options: Options = {}): [T, Dispatch<SetStateAction<T>>] => {
    const {debounce, namespace} = options;
    const storageKey = `${namespace || 'default'}/${key}`;
    const [value, setValue] = useState<T>(() => {
        const storedValue = localStorage.getItem(storageKey);
        console.log({storageKey, storedValue});
        if (!storedValue) {
            return defaultValue;
        } else {
            return JSON.parse(storedValue);
        }
    });

    const save = useMemo(() => debounced((value: T) => {
        localStorage.setItem(storageKey, JSON.stringify(value));
    }, debounce), [debounce, storageKey]);

    useEffect(() => {
        save(value);
    }, [save, value]);

    return [
        value,
        setValue
    ]
}