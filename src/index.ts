
import {DefenderGame, DefenderGameElements} from './DefenderGame'

import './style.css'


const canvas = document.querySelector('canvas')

const elements: DefenderGameElements = {
    pauseButton: document.querySelector('#pauseButton'),
    resetButton: document.querySelector('#resetButton'),
    score: document.querySelector('#score'),
    level: document.querySelector('#level'),
}


const globalContext = window as any;
globalContext.game = new DefenderGame(canvas, elements);