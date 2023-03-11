import React from "react";
import {AudioContextProvider} from "./hooks/useAudioContext";
import {ProjectSelectionPage} from "./pages/ProjectSelectionPage";
import {SketchPage} from "./pages/SketchPage";
import {AudioNodeRegisterProvider} from "./hooks/useAudioNodeRegister";

export const App = () => {
    return (
        <AudioContextProvider>
            <ProjectSelectionPage>
                <AudioNodeRegisterProvider>
                    <SketchPage/>
                </AudioNodeRegisterProvider>
            </ProjectSelectionPage>
        </AudioContextProvider>
    );
};
