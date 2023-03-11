import {useState} from "react";

export interface Options {
    namespace?: string;
    debounce?: number;
}

export const usePersistedState = <T>(key: string, defaultValue: T, options: Options = {}): [T, (value: T) => void] => {
    const [value, setValue] = useState<T>(defaultValue);

    // TODO: Persist

    return [
        value,
        (newValue: T) => {
            setValue(newValue);
        }
    ]
}