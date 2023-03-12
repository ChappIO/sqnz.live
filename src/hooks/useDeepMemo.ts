import {useEffect, useState} from "react";


export const useDeepMemo = <T>(value: T): T => {
    const [jsonValue, setJsonValue] = useState(JSON.stringify(value));
    const [internalValue, setValue] = useState(value);

    useEffect(() => {
        const newJsonValue = JSON.stringify(value);
        if (jsonValue !== newJsonValue) {
            setValue(value);
            setJsonValue(newJsonValue);
        }
    }, [jsonValue, value]);

    return internalValue;
}