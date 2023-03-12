import {Node, NodeProps} from "./Node";
import {useSingleton} from "../hooks/useSingleton";
import {useAudioContext} from "../hooks/useAudioContext";
import {useGetAudioNode, useRegisterAudioNode} from "../hooks/useAudioNodeRegister";
import {useEffect, useMemo, useState} from "react";
import {usePersistedState} from "../hooks/usePersistedState";
import {useProject} from "../hooks/useProject";


export enum ReverbFiles {
    "Block Inside" = "Block Inside.wav",
    "Bottle Hall" = "Bottle Hall.wav",
    "Cement Blocks 1" = "Cement Blocks 1.wav",
    "Cement Blocks 2" = "Cement Blocks 2.wav",
    "Chateau de Logne, Outside" = "Chateau de Logne, Outside.wav",
    "Conic Long Echo Hall" = "Conic Long Echo Hall.wav",
    "Deep Space" = "Deep Space.wav",
    "Derlon Sanctuary" = "Derlon Sanctuary.wav",
    "Direct Cabinet N1" = "Direct Cabinet N1.wav",
    "Direct Cabinet N2" = "Direct Cabinet N2.wav",
    "Direct Cabinet N3" = "Direct Cabinet N3.wav",
    "Direct Cabinet N4" = "Direct Cabinet N4.wav",
    "Five Columns" = "Five Columns.wav",
    "Five Columns Long" = "Five Columns Long.wav",
    "French 18th Century Salon" = "French 18th Century Salon.wav",
    "Going Home" = "Going Home.wav",
    "Greek 7 Echo Hall" = "Greek 7 Echo Hall.wav",
    "Highly Damped Large Room" = "Highly Damped Large Room.wav",
    "In The Silo" = "In The Silo.wav",
    "In The Silo Revised" = "In The Silo Revised.wav",
    "Large Bottle Hall" = "Large Bottle Hall.wav",
    "Large Long Echo Hall" = "Large Long Echo Hall.wav",
    "Large Wide Echo Hall" = "Large Wide Echo Hall.wav",
    "Masonic Lodge" = "Masonic Lodge.wav",
    "Musikvereinsaal" = "Musikvereinsaal.wav",
    "Narrow Bumpy Space" = "Narrow Bumpy Space.wav",
    "Nice Drum Room" = "Nice Drum Room.wav",
    "On a Star" = "On a Star.wav",
    "Parking Garage" = "Parking Garage.wav",
    "Rays" = "Rays.wav",
    "Right Glass Triangle" = "Right Glass Triangle.wav",
    "Ruby Room" = "Ruby Room.wav",
    "Scala Milan Opera Hall" = "Scala Milan Opera Hall.wav",
    "Small Drum Room" = "Small Drum Room.wav",
    "Small Prehistoric Cave" = "Small Prehistoric Cave.wav",
    "St Nicolaes Church" = "St Nicolaes Church.wav",
    "Trig Room" = "Trig Room.wav",
    "Vocal Duo" = "Vocal Duo.wav",
}

export type ReverbPreset = keyof typeof ReverbFiles;

export interface Props extends NodeProps {

}

export const ReverbNode = ({...nodeProps}: NodeProps) => {
    const project = useProject();
    const destinations = useMemo(() => nodeProps.outputs.filter(o => o.type === 'audio').map(o => o.to), [nodeProps.outputs]);
    const getAudioNode = useGetAudioNode();
    const context = useAudioContext();
    const convolver = useSingleton(() => {
            return context.createConvolver();
        },
    );
    useRegisterAudioNode(nodeProps.id, convolver);

    const [preset, setPreset] = usePersistedState<ReverbPreset>('preset', 'In The Silo Revised', {
        namespace: `${project.namespace}/nodes/${nodeProps.id}`
    });

    useEffect(() => {
        if (preset) {
            fetch(`/reverb/${ReverbFiles[preset]}`)
                .then((result) => result.arrayBuffer())
                .then((buffer) => context.decodeAudioData(buffer))
                .then((buffer) => (convolver.buffer = buffer));
        }
    }, [preset, context, convolver]);


    const [connectedTo, setConnectedTo] = useState<string[]>([]);
    useEffect(() => {
        // connect to needed destinations
        for (let destination of destinations) {
            if (!connectedTo.includes(destination)) {
                const node = getAudioNode(destination);
                if (node) {
                    convolver.connect(node);
                    setConnectedTo(prev => [...prev, destination]);
                }
            }
        }
        // disconnect from others
        for (let destination of connectedTo) {
            if (!destinations.includes(destination)) {
                const node = getAudioNode(destination);
                if (node) {
                    convolver.disconnect(node);
                    setConnectedTo(prev => prev.filter(c => c !== destination));
                }
            }
        }

    }, [convolver, destinations, connectedTo, getAudioNode]);

    return (
        <Node {...nodeProps} icon="fa-explosion" name="Reverb">
            <div className="form-group">
                <label htmlFor="preset">Preset</label>
                <select id="preset" value={preset} onChange={(e) => setPreset(e.target.value as any)}>
                    {Object.keys(ReverbFiles).map(name => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
            </div>
        </Node>
    )
}