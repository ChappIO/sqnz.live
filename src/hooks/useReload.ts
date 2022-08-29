import {useCallback, useState} from "react";


export const useReload = () => {
    const [, setToggle] = useState(false);
    return useCallback(() => setToggle(prev => !prev), []);
}
