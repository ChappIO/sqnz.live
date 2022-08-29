import {Note} from "../music/Note";
import {useEffect, useState} from "react";
import {useKey} from "../hooks/useKeyDown";

const NoteNames = Object.keys(Note).filter(i => !parseInt(i));

export interface Props {
    value: Note | undefined;
    playingNote: Note | undefined;
    onChange: (note: Note | undefined) => void;
}

const displayNoteCount = 25;

export const Keyboard = ({value, playingNote, onChange}: Props) => {
    const [oct, setOct] = useState(3);

    const baseNote = oct * 12;
    const selectedNoteIndex = value !== undefined ? NoteNames.indexOf(Note[value]) : undefined;
    const playingNoteIndex = playingNote !== undefined ? NoteNames.indexOf(Note[playingNote]) : undefined;

    // Autoscroll the keyboard to show selected note
    useEffect(() => {
        if (!selectedNoteIndex) {
            // nothing to do
            return;
        }

        const lastNote = baseNote + displayNoteCount - 1;
        if (lastNote < selectedNoteIndex) {
            const noteIndexOct = Math.floor(selectedNoteIndex / 12) - 1;
            setOct(noteIndexOct);
        } else if (baseNote > selectedNoteIndex) {
            const noteIndexOct = Math.floor(selectedNoteIndex / 12);
            setOct(noteIndexOct);
        }
        // I only want to do this change when the selected note changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNoteIndex]);

    useKey('keydown', 'Delete', () => {
        onChange(undefined);
    });


    return (
        <div className="keyboard">
            {Array(displayNoteCount).fill(null).map((_, i) => {
                const noteIndex = baseNote + i;
                return (
                    <div key={i} className={`key ${selectedNoteIndex === noteIndex ? 'selected' : ''} ${playingNoteIndex === noteIndex ? 'playing' : ''}`}
                         onClick={() => {
                             onChange(Note[NoteNames[noteIndex] as keyof typeof Note]);
                         }}>
                        <span>{NoteNames[noteIndex]}</span>
                    </div>
                )
            })}
            <div className="buttons">
                <button onClick={() => {
                    onChange(undefined);
                }}>
                    <i className="fas fa-trash"/>
                </button>
                <button onClick={() => {
                    setOct(prev => Math.max(prev - 1, 0));
                }}>
                    <i className="fas fa-chevron-left"/>
                </button>
                <button onClick={() => {
                    setOct(prev => Math.min(prev + 1, 6));
                }}>
                    <i className="fas fa-chevron-right"/>
                </button>
            </div>
        </div>
    )
}
