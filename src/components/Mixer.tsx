import React, {PropsWithChildren} from "react";

export const Mixer = ({children}: PropsWithChildren) => {
    return (
        <div className="mixer">
            {children}
        </div>
    );
}
