import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {useProject} from "./useProject";
import {useHotkey} from "./useHotkey";

export interface Track {
}

export interface TrackContext {
    track: Track;
    trackNumber: number;
}


const Context = createContext<TrackContext | undefined>(undefined);

export const TrackProvider = ({children}: PropsWithChildren) => {
    const project = useProject();
    const [trackNumber, setTrackNumber] = useState(0);

    useEffect(() => {
        const clampedTrack = Math.max(0, Math.min(project.tracks.length - 1, trackNumber));
        if (trackNumber !== clampedTrack) {
            setTrackNumber(trackNumber);
        }
    }, [project, trackNumber]);

    useHotkey('Digit0', () => {
        project.tracks.push({});
        setTrackNumber(project.tracks.length - 1);
    });
    useHotkey('Minus', () => {
        setTrackNumber(Math.max(trackNumber - 1, 0));
    });
    useHotkey('Equal', () => {
        setTrackNumber(Math.min(trackNumber + 1, project.tracks.length - 1));
    });

    const track = project.tracks[trackNumber];
    return <Context.Provider value={{track, trackNumber: trackNumber + 1}}>{children}</Context.Provider>
}

export const useTrack = (): TrackContext => {
    const track = useContext(Context);
    if (!track) {
        throw new Error('Call from TrackProvider');
    }
    return track;
};
