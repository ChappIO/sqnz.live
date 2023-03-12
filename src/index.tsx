import React from "react";
import ReactDOM from "react-dom/client";
import {App} from "./App";
import "./reset.scss";
import "papercss";
import "@fortawesome/fontawesome-free/css/all.min.css";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(<App/>);

serviceWorkerRegistration.register();