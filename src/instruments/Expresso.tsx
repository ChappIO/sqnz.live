import { useDestination } from "../hooks/useDestination";
import "./Expresso.scss";
import { useState } from "react";
import { Piano } from "../components/Piano";
import { Reverb } from "../components/audio/Reverb";
import { Compressor } from "../components/audio/Compressor";

interface Note {
  osc: OscillatorNode;
  gain: GainNode;
}

export interface SoundProps {
  mode: OscillatorType;
  oct: number;
}

export const SoundSource = ({ mode, oct }: SoundProps) => {
  const destination = useDestination();

  function onNoteStart({ freq }: { freq: number }) {
    const gain = destination.context.createGain();
    gain.connect(destination);
    gain.gain.setValueAtTime(0, destination.context.currentTime);
    const osc = destination.context.createOscillator();
    osc.frequency.setValueAtTime(freq, destination.context.currentTime);
    osc.type = mode;
    osc.connect(gain);
    osc.start();
    gain.gain.setTargetAtTime(1, destination.context.currentTime, 0.01);
    return {
      gain,
      osc,
    };
  }

  function onNotePitch({ note, detune }: { note: Note; detune: number }) {
    note.osc.detune.setValueAtTime(detune, destination.context.currentTime);
  }

  function onNoteStop({ note }: { note: Note }) {
    note.gain.gain.setTargetAtTime(0, destination.context.currentTime, 0.02);
    setTimeout(() => {
      note.osc.stop();
      note.osc.disconnect();
      note.gain.disconnect();
    }, 300);
  }

  return (
    <>
      <Piano<Note>
        baseNote={`c${oct}`}
        noteCount={13}
        onNoteStart={onNoteStart}
        onNotePitch={onNotePitch}
        onNoteStop={onNoteStop}
      />
    </>
  );
};

const modes: OscillatorType[] = ["sine", "triangle", "sawtooth", "square"];
export const Synth = () => {
  const [mode, setMode] = useState(0);
  const [oct, setOct] = useState(5);
  const [reverb, setReverb] = useState(false);
  return (
    <div className="Synth">
      <div className="Controls">
        <button
          onClick={() => {
            setMode((mode + 1) % modes.length);
          }}
        >
          {modes[mode].substring(0, 3)}
        </button>
        <button
          onClick={() => {
            setOct(oct + 1);
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            setOct(oct - 1);
          }}
        >
          -
        </button>
        <button
          onClick={() => {
            setReverb(!reverb);
          }}
        >
          {reverb ? "✅" : "❌"}
        </button>
      </div>
      {reverb ? (
        <Reverb preset="In The Silo">
          <SoundSource oct={oct} mode={modes[mode]} />
        </Reverb>
      ) : (
        <SoundSource oct={oct} mode={modes[mode]} />
      )}
    </div>
  );
};

export const Expresso = () => {
  return (
    <div className="Expresso">
      <Compressor
        threshold={-20}
        knee={40}
        ratio={12}
        attack={0}
        release={0.25}
      >
        <Synth />
        <Synth />
      </Compressor>
    </div>
  );
};
