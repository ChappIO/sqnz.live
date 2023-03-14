import React from "react";
import {AudioContextProvider} from "./hooks/useAudioContext";
import {ProjectSelectionPage} from "./pages/ProjectSelectionPage";
import {SketchPage} from "./pages/SketchPage";
import {AudioNodeRegisterProvider} from "./hooks/useAudioNodeRegister";
import {TriggerNodeRegisterProvider} from "./hooks/useTriggerNodeRegister";
import {Clock, ClockContext} from "./hooks/useClock";

const clock = new Clock();

export const App = () => {
    return (
        <ClockContext.Provider value={clock}>
            <AudioContextProvider>
                <ProjectSelectionPage>
                    <TriggerNodeRegisterProvider>
                        <AudioNodeRegisterProvider>
                            <SketchPage/>
                        </AudioNodeRegisterProvider>
                    </TriggerNodeRegisterProvider>
                </ProjectSelectionPage>
            </AudioContextProvider>
        </ClockContext.Provider>
    );
};
