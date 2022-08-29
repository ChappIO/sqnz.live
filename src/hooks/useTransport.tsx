import {EventEmitter} from "../utils/EventEmitter";
import {createContext, useContext} from "react";

export interface TransportEvent {
    play: void
    pulse: void;
    stop: void
}

export class Transport extends EventEmitter<TransportEvent> {
    private pulseTimer: number | undefined;
    private bpm = 120;
    public readonly pps = 4;

    public play() {
        this.startPulse();
        this.fire('play', undefined);
    }

    public stop() {
        this.fire('stop', undefined);
        clearInterval(this.pulseTimer);
        this.pulseTimer = undefined;
    }

    private startPulse() {
        if(this.pulseTimer) {
            clearInterval(this.pulseTimer);
        }
        this.pulseTimer = setInterval(
            () => this.pulse(),
            this.getPulseLength() * 1000
        ) as any;
    }

    private pulse() {
        this.fire('pulse', undefined);
    }

    public isPlaying(): boolean {
        return !!this.pulseTimer;
    }

    setBpm(bpm: number) {
        this.bpm = bpm;
        if (this.pulseTimer) {
            // we're playing to change the timing
            this.startPulse();
        }
    }

    public getPulseLength(): number {
        return 60 / this.bpm / this.pps;
    }
}

const Context = createContext(new Transport());

export const useTransport = () => useContext(Context);
