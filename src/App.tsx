import React from 'react';
import {Mixer} from "./components/Mixer";
import {Instrument} from "./components/Instrument";

export const App = () => (
    <div>
        <h1>SQNZ.<sub>live</sub></h1>
        <Mixer>
            <Instrument/>
            <Instrument/>
            <Instrument/>
        </Mixer>
    </div>
);
