import React from "react";
import {AudioContextProvider} from "./hooks/useAudioContext";
import {ProjectSelectionPage} from "./pages/ProjectSelectionPage";
import {SketchPage} from "./pages/SketchPage";
import {AudioNodeRegisterProvider} from "./hooks/useAudioNodeRegister";
import {TriggerNodeRegisterProvider} from "./hooks/useTriggerNodeRegister";

export const App = () => {
    return (
        <AudioContextProvider>
            <ProjectSelectionPage>
                <TriggerNodeRegisterProvider>
                    <AudioNodeRegisterProvider>
                        <SketchPage/>
                    </AudioNodeRegisterProvider>
                </TriggerNodeRegisterProvider>
            </ProjectSelectionPage>
        </AudioContextProvider>
    );
};
