import React from "react";
import {SplashScreen} from "./components/SplashScreen";
import {SketchBook} from "./components/SketchBook";

export const App = () => {
    return (
        <SplashScreen>
            <SketchBook/>
        </SplashScreen>
    );
};
