import * as physicsWorlds from "physics-worlds"

interface BombWaveFunction {
    (tickCount: number): number
}

class DefenderGameLevel {
    duration: number
    contents: physicsWorlds.Body[]
    height: number
    width: number
    gravity:number
    airDensity:number
    bombWaveFunction: BombWaveFunction
    backgrounds: physicsWorlds.BackGround[]

    constructor(data: {
        duration: number
        contents: physicsWorlds.Body[]
        height: number
        width: number
        gravity?: number
        airDensity?: number
        bombWaveFunction: BombWaveFunction
        backgrounds?: physicsWorlds.BackGround[]
    }) {
        this.duration = data.duration
        this.contents = data.contents;
        this.height = data.height;
        this.width = data.width;
        this.gravity = data.gravity || 1
        this.airDensity = data.airDensity || .1
        this.bombWaveFunction = data.bombWaveFunction;
        this.backgrounds = data.backgrounds || []
    }
}

export { DefenderGameLevel }