import * as Engine from '../../worlds/src/index'
import { Building } from './Building'
import { MissileSilo } from './MissileSilo'
import { DefenderGameLevel } from './DefenderGameLevel'
import { makeSkyBackground } from './gradients'

const blueSky = makeSkyBackground([[.2, 'black'], [.8, 'skyblue']])
const purpleSky = makeSkyBackground([[.2, 'black'], [.9, 'purple']])

const stars = new Engine.StarField({
    numberOfStars: 50,
    depth: 1,
    height: 600,
    width: 6000,
})

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
        backgrounds: [blueSky, stars],
        height: 3000,
        width: 4000,
        gravity: .8,
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
            makeSiloOnGround(4 / 8, 2800, 4000),
            makeBuildingOnGround(1 / 8, 100, 2800, 4000),
            makeBuildingOnGround(3 / 8, 80, 2800, 4000),
            makeBuildingOnGround(7.5 / 8, 100, 2800, 4000),
            makeGround(2800, 4000, 'red')
        ],
        backgrounds: [purpleSky],
        height: 3000,
        width: 4000,
        bombWaveFunction: function (tickCount: number) {
            if (tickCount % 150 == 0) {
                return Math.min(Math.floor(2.5 + tickCount / 400), 15)
            }
            return 0
        }
    }),
    new DefenderGameLevel({
        duration: 1200,
        contents: [
            makeSiloOnGround(2 / 8, 4700, 6000),
            makeSiloOnGround(6 / 8, 4700, 6000),
            makeBuildingOnGround(1 / 8, 100, 4700, 6000),
            makeBuildingOnGround(3 / 8, 80, 4700, 6000),
            makeBuildingOnGround(7.5 / 8, 100, 4700, 6000),
            makeGround(4700, 6000, 'brown')
        ],
        height: 5000,
        width: 6000,
        airDensity: .01,
        gravity: .5,
        backgrounds:[stars],
        bombWaveFunction: function (tickCount: number) {
            if (tickCount % 150 == 0) {
                return Math.min(Math.floor(4 + tickCount / 300), 18)
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
            globalGravityForce: new Engine.Force(level.gravity, 0),
            gravitationalConstant: .125,
            airDensity: level.airDensity,
            backGrounds: level.backgrounds,
        })

}

export { createWorldFromLevel, levels }