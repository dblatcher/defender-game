import * as Engine from '../../worlds/src/index'
import { Building } from './Building'
import { MissileSilo } from './MissileSilo'
import { DefenderGameLevel } from './DefenderGameLevel'


const siloSize = 150

function makeSiloOnGround(relativeX: number, groundLevel: number, worldWidth: number) {
    return new MissileSilo({
        fillColor: 'blue', color: 'red',
        x: worldWidth * relativeX,
        y: groundLevel - siloSize * (.25),
        size: siloSize,
        heading: Math.PI
    })
}

function makeBuildingOnGround(relativeX: number, size: number, groundLevel: number, worldWidth: number) {
    return new Building({
        size,
        y: groundLevel - size,
        x: worldWidth * relativeX,
        fillColor: 'grey',
        color: 'white',
    })
}

function makeGround(groundLevel: number, worldWidth: number, fill: string | Engine.AbstractGradientFill = 'brown') {
    return new Engine.Body({
        shape: Engine.shapes.square,
        x: worldWidth / 2, y: groundLevel + worldWidth / 2, size: worldWidth / 2,
        elasticity: .1,
        immobile: true,
        fillColor: fill,
        heading: Math.PI
    })
}

const levels = [
    new DefenderGameLevel({
        duration: 600,
        contents: [
            makeSiloOnGround(2 / 8, 2900, 4000),
            makeSiloOnGround(6 / 8, 2900, 4000),
            makeBuildingOnGround(1 / 8, 100, 2900, 4000),
            makeBuildingOnGround(3 / 8, 80, 2900, 4000),
            makeBuildingOnGround(7.5 / 8, 100, 2900, 4000),
            makeGround(2900, 4000, 'green')
        ],
        height: 3000,
        width: 4000,
        bombWaveFunction: function (tickCount: number) {
            if (tickCount % 200 == 0) {
                return Math.min(Math.floor(2 + tickCount / 400), 15)
            }
            return 0
        }
    }),
    new DefenderGameLevel({
        duration: 1000,
        contents: [
            makeSiloOnGround(4 / 8, 2400, 4000),
            makeBuildingOnGround(1 / 8, 100, 2400, 4000),
            makeBuildingOnGround(3 / 8, 80, 2400, 4000),
            makeBuildingOnGround(7.5 / 8, 100, 2400, 4000),
            makeGround(2400, 4000, 'red')
        ],
        height: 3000,
        width: 4000,
        bombWaveFunction: function (tickCount: number) {
            if (tickCount % 150 == 0) {
                return Math.min(Math.floor(2.5 + tickCount / 400), 15)
            }
            return 0
        }
    }),
]


function createWorldFromLevel(level: DefenderGameLevel) {

    return new Engine.World(
        level.contents.map(body => body.duplicate())
        , {
            width: level.width,
            height: level.height,
            globalGravityForce: new Engine.Force(.5, 0),
            gravitationalConstant: .25,
            airDensity: .1,
        })

}

export { createWorldFromLevel, levels }