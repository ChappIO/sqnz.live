import {useAudioContext} from "../hooks/useAudioContext";
import {useSingleton} from "../hooks/useSingleton";
import {AudioDestinationProvider, useDestination} from "../hooks/useDestination";
import {PropsWithChildren, useEffect} from "react";

export enum ReverbTypes {
    'Block Inside' = 'Block Inside.wav',
    'Bottle Hall' = 'Bottle Hall.wav',
    'Cement Blocks 1' = 'Cement Blocks 1.wav',
    'Cement Blocks 2' = 'Cement Blocks 2.wav',
    'Chateau de Logne, Outside' = 'Chateau de Logne, Outside.wav',
    'Conic Long Echo Hall' = 'Conic Long Echo Hall.wav',
    'Deep Space' = 'Deep Space.wav',
    'Derlon Sanctuary' = 'Derlon Sanctuary.wav',
    'Direct Cabinet N1' = 'Direct Cabinet N1.wav',
    'Direct Cabinet N2' = 'Direct Cabinet N2.wav',
    'Direct Cabinet N3' = 'Direct Cabinet N3.wav',
    'Direct Cabinet N4' = 'Direct Cabinet N4.wav',
    'Five Columns' = 'Five Columns.wav',
    'Five Columns Long' = 'Five Columns Long.wav',
    'French 18th Century Salon' = 'French 18th Century Salon.wav',
    'Going Home' = 'Going Home.wav',
    'Greek 7 Echo Hall' = 'Greek 7 Echo Hall.wav',
    'Highly Damped Large Room' = 'Highly Damped Large Room.wav',
    'In The Silo' = 'In The Silo.wav',
    'In The Silo Revised' = 'In The Silo Revised.wav',
    'Large Bottle Hall' = 'Large Bottle Hall.wav',
    'Large Long Echo Hall' = 'Large Long Echo Hall.wav',
    'Large Wide Echo Hall' = 'Large Wide Echo Hall.wav',
    'Masonic Lodge' = 'Masonic Lodge.wav',
    'Musikvereinsaal' = 'Musikvereinsaal.wav',
    'Narrow Bumpy Space' = 'Narrow Bumpy Space.wav',
    'Nice Drum Room' = 'Nice Drum Room.wav',
    'On a Star' = 'On a Star.wav',
    'Parking Garage' = 'Parking Garage.wav',
    'Rays' = 'Rays.wav',
    'Right Glass Triangle' = 'Right Glass Triangle.wav',
    'Ruby Room' = 'Ruby Room.wav',
    'Scala Milan Opera Hall' = 'Scala Milan Opera Hall.wav',
    'Small Drum Room' = 'Small Drum Room.wav',
    'Small Prehistoric Cave' = 'Small Prehistoric Cave.wav',
    'St Nicolaes Church' = 'St Nicolaes Church.wav',
    'Trig Room' = 'Trig Room.wav',
    'Vocal Duo' = 'Vocal Duo.wav',
}

export interface Props {
    preset: keyof typeof ReverbTypes
}

export const Reverb = ({children, preset}: PropsWithChildren<Props>) => {
    const context = useAudioContext();
    const destination = useDestination();
    const convolver = useSingleton(() => context.createConvolver());

    useEffect(() => {
        convolver.connect(destination);
        return () => convolver.disconnect();
    }, [convolver, destination]);

    useEffect(() => {
        fetch(`/reverb/${ReverbTypes[preset]}`)
            .then(result => result.arrayBuffer())
            .then(buffer => context.decodeAudioData(buffer))
            .then(buffer => convolver.buffer = buffer)
    }, [preset, convolver, context]);

    return (
        <AudioDestinationProvider destination={convolver}>
            {children}
        </AudioDestinationProvider>
    )
}
