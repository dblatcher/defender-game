import * as Engine from '../../worlds/src/index'

interface BombWaveFunction {
    (tickCount: number): number
}

class DefenderGameLevel {
    duration: number
    contents: Engine.Body[]
    height: number
    width: number
    gravity:number
    airDensity:number
    bombWaveFunction: BombWaveFunction

    constructor(data: {
        duration: number
        contents: Engine.Body[]
        height: number
        width: number
        gravity?: number
        airDensity?: number
        bombWaveFunction: BombWaveFunction
    }) {
        this.duration = data.duration
        this.contents = data.contents;
        this.height = data.height;
        this.width = data.width;
        this.gravity = data.gravity || 1
        this.airDensity = data.airDensity || .1
        this.bombWaveFunction = data.bombWaveFunction;
    }
}

export { DefenderGameLevel }