
import { DefenderGame, DefenderGameElements } from './DefenderGame'


function init() {

    const elements: DefenderGameElements = {
        pauseButton: document.querySelector('#pauseButton'),
        resetButton: document.querySelector('#resetButton'),
        score: document.querySelector('#score'),
        level: document.querySelector('#level'),
        caption: document.querySelector('#caption'),
    }

    const globalContext = window as any;
    globalContext.game = new DefenderGame(document.querySelector('canvas'), elements, { frameFill: 'antiquewhite' });
}

window.addEventListener('load', init, { once: true });