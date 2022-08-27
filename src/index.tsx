import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './App';
import './style.scss';
import {AudioContextProvider} from "./hooks/useAudioContext";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <AudioContextProvider>
        <App/>
    </AudioContextProvider>
);
