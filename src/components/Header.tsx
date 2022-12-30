import {useProject} from "../hooks/useProject";
import {useTrack} from "../hooks/useTrack";

export const Header = () => {
    const project = useProject();
    const {trackNumber} = useTrack();
    return (
        <header>
            T{trackNumber} - {project.name}
        </header>
    )
}
