
import { SoundPlayer } from '../../worlds/src';
import { DefenderGame, DefenderGameElements } from './DefenderGame'


const sounds = {
    alarm: require('../assets/arcade_game_alarm_short.mp3'),
    blast: require('../assets/esm_8bit_explosion_bomb_boom_blast_cannon_retro_old_school_classic_cartoon.mp3'),
    boom: require('../assets/esm_8bit_explosion_heavy_bomb_boom_blast_cannon_retro_old_school_classic_cartoon.mp3'),
    shoot: require('../assets/esm_8bit_splat_bomb_boom_blast_cannon_retro_old_school_classic_cartoon.mp3'),
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