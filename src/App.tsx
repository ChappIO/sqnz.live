import React from "react";
import {AudioContextProvider} from "./hooks/useAudioContext";
import {ProjectSelectionPage} from "./pages/ProjectSelectionPage";
import {SketchPage} from "./pages/SketchPage";

export const App = () => {
    return (
        <AudioContextProvider>
            <ProjectSelectionPage>
                <SketchPage/>
            </ProjectSelectionPage>
        </AudioContextProvider>
    );
};
