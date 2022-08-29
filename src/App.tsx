import React from 'react';
import {Mixer} from "./components/Mixer";
import {TransportControls} from "./components/TransportControls";

export const App = () => {
    return (
        <div>
            <h1>SQNZ.<sub>live</sub></h1>
            <TransportControls/>
            <Mixer>
            </Mixer>
        </div>
    );
}