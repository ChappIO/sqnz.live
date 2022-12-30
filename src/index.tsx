import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './App';
import './index.scss';
import {ProjectProvider} from "./hooks/useProject";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ProjectProvider>
            <App/>
        </ProjectProvider>
    </React.StrictMode>
);
