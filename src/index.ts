
import { SoundPlayer } from "physics-worlds";
import { DefenderGame, DefenderGameElements } from './DefenderGame'


const sounds = {
    alarm: require('../assets/arcade_game_alarm_short.mp3'),
    blast: require('../assets/explode.mp3'),
    boom: require('../assets/bang.mp3'),
    shoot: require('../assets/shoot.mp3'),
}


function init() {

    const soundPlayer = new SoundPlayer(sounds)

    const elements: DefenderGameElements = {
        pauseButton: document.querySelector('#pauseButton'),
        resetButton: document.querySelector('#resetButton'),
        score: document.querySelector('#score'),
        level: document.querySelector('#level'),
        caption: document.querySelector('#caption'),
    }

    const globalContext = window as any;
    globalContext.game = new DefenderGame(
        document.querySelector('canvas'), 
        elements, 
        { frameFill: 'antiquewhite', soundPlayer }
    );
}

window.addEventListener('load', init, { once: true });