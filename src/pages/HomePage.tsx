import './HomePage.scss';
import * as Tone from 'tone';

export class HomePage extends HTMLElement {
    readonly innerHTML = `
    <h1>SQNZ<sub>.live</sub></h1>
    <button class="play-button">Play</button>
    `

    constructor() {
        super();

        this.querySelector('.play-button')!.addEventListener('click', async () => {
            await Tone.start();
            Tone.Transport.start();
            Tone.Transport.bpm.setValueAtTime(120, Tone.now());
        });
    }
}

window.customElements.define('home-page', HomePage);
