import './Piano.scss';
import {Interval, Note} from 'tonal';
import {TouchEvent, useState} from "react";

export interface Props<T> {
    onNoteStart: (e: { freq: number }) => T;
    onNotePitch: (e: { note: T, detune: number }) => void;
    onNoteStop: (e: { note: T }) => void;
    baseNote: string;
    noteCount: number;
}

interface Touch<T> {
    touchId: number;
    startX: number;
    startY: number;
    note: T;
}

export const Piano = <T extends {}>({onNoteStart, onNotePitch, onNoteStop, baseNote, noteCount}: Props<T>) => {
    const [notes, setNotes] = useState<Touch<T>[]>([]);
    return (
        <div className="Piano">
            {Array(noteCount).fill(null).map((_, i) => {
                const note = Note.get(Note.transpose(baseNote, Interval.fromSemitones(i)));
                return (
                    <div key={i}
                         className={`key ${note.acc ? 'black' : ''}`}
                         onTouchStart={(e: TouchEvent) => {
                             for (let i = 0; i < e.changedTouches.length; i++) {
                                 const t = e.changedTouches[i];
                                 const touch: Touch<T> = {
                                     touchId: t.identifier,
                                     startX: t.clientX,
                                     startY: t.clientY,
                                     note: onNoteStart({
                                         freq: note.freq!,
                                     })
                                 };
                                 setNotes(prev => [...prev, touch]);
                             }
                         }}
                         onTouchMove={(e: TouchEvent) => {
                             for (let i = 0; i < e.changedTouches.length; i++) {
                                 const t = e.changedTouches[i];
                                 const touch = notes.filter(n => n.touchId == t.identifier)[0];
                                 if (!touch) {
                                     continue;
                                 }
                                 const detune = (touch.startY - t.clientY) / 50 * 100;
                                 onNotePitch({
                                     note: touch.note,
                                     detune,
                                 });
                             }
                         }}
                         onTouchEnd={(e: TouchEvent) => {
                             for (let i = 0; i < e.changedTouches.length; i++) {
                                 const t = e.changedTouches[i];
                                 const touch = notes.filter(n => n.touchId == t.identifier)[0];
                                 if (!touch) {
                                     continue;
                                 }
                                 onNoteStop({note: touch.note});
                                 setNotes(prev => prev.filter(n => n !== touch));
                             }
                         }}
                    >
                        {note.name}
                    </div>
                )
            })}
        </div>
    )
}