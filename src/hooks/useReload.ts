import {useCallback, useState} from "react";


export const useReload = () => {
    const [toggle, setToggle] = useState(false);
    return useCallback(() => setToggle(prev => !prev), []);
}
