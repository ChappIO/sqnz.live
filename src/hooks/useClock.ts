import {createContext, useContext} from "react";


export type BeatHandler = (beat: number) => void;
export type StepHandler = (beat: number, step: number) => void;
export type Unsubscribe = () => void;

export class Clock {
    private readonly beatHandlers: Record<number, BeatHandler> = {};
    private readonly stepHandlers: Record<number, StepHandler> = {};
    private handlerCounter = 0;
    public bpm = 70;
    public readonly stepsPerBeat = 4;
    private stepCounter = 0;
    private beatCounter = 0;

    constructor() {
        this.fireStep();
    }

    public get step() {
        return this.stepCounter;
    }

    public get beat() {
        return Math.floor(this.stepCounter / this.stepsPerBeat);
    }

    private fireStep() {
        this.stepCounter = (this.stepCounter + 1) % this.stepsPerBeat;

        if (this.stepCounter === 0) {
            this.beatCounter++;
            for (let key in this.beatHandlers) {
                this.beatHandlers[key](this.beatCounter);
            }
        }
        for (let key in this.stepHandlers) {
            this.stepHandlers[key](this.beatCounter, this.stepCounter);
        }

        const timeBetweenTicks = 60000 / this.bpm / this.stepsPerBeat;
        const nextTick = timeBetweenTicks - Date.now() % timeBetweenTicks;
        setTimeout(() => {
            this.fireStep();
        }, nextTick);
    }

    onBeat(handler: BeatHandler): Unsubscribe {
        const handlerId = this.handlerCounter++;
        this.beatHandlers[handlerId] = handler;
        return () => {
            delete this.beatHandlers[handlerId];
        };
    }

    onStep(handler: StepHandler): Unsubscribe {
        const handlerId = this.handlerCounter++;
        this.stepHandlers[handlerId] = handler;
        return () => {
            delete this.stepHandlers[handlerId];
        };
    }
}

export const ClockContext = createContext<Clock | undefined>(undefined);

export const useClock = () => useContext(ClockContext)!;
