
import { DefenderGame, DefenderGameElements } from './DefenderGame'


const canvas = document.querySelector('canvas')

const elements: DefenderGameElements = {
    pauseButton: document.querySelector('#pauseButton'),
    resetButton: document.querySelector('#resetButton'),
    score: document.querySelector('#score'),
    level: document.querySelector('#level'),
    caption: document.querySelector('#caption'),
}


const globalContext = window as any;
globalContext.game = new DefenderGame(canvas, elements, { frameFill: 'antiquewhite' });