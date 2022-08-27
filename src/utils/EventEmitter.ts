export type EventListener<T> = (event: T) => void;

export type EventListeners<E> = {
    [R in keyof E]?: EventListener<E[R]>[];
}

export class EventEmitter<E> {
    private listeners: EventListeners<E> = {}

    public addEventListener<R extends keyof E>(eventType: R, listener: EventListener<E[R]>) {
        const concreteListeners = this.listeners[eventType];
        if (concreteListeners) {
            concreteListeners.push(listener);
        } else {
            this.listeners[eventType] = [listener];
        }
        return () => {
            this.removeEventListener(eventType, listener);
        }
    }

    public removeEventListener<R extends keyof E>(eventType: R, listener: EventListener<E[R]>) {
        this.listeners[eventType] = this.listeners[eventType]?.filter(l => l === listener);
    }

    public fire<R extends keyof E>(eventType: R, event: E[R]) {
        const concreteListeners = this.listeners[eventType];
        if (!concreteListeners) {
            return;
        }
        for (let listener of concreteListeners) {
            listener(event);
        }
    }

    public unsubscribe(...callbacks: (() => void)[]): () => void {
        return () => callbacks.forEach(c => c());
    }
}
