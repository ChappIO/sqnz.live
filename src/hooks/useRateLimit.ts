import {useRef} from "react";

export const useRateLimit = <T extends (...args: any) => any>(time: number, func: T) => {
    let canCall = useRef(true);

    return (...args: Parameters<T>) => {
        if (canCall.current) {
            canCall.current = false;
            func(...args);
            setTimeout(() => canCall.current = true, time);
        }
    }
}
