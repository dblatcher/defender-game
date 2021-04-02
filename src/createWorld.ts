import * as Engine from '../../worlds/src/index'
import { Building } from './Building'
import { MissileSilo } from './MissileSilo'
import { DefenderGameLevel } from './DefenderGameLevel'
import { makeSkyBackground } from './gradients'

const blueSky = makeSkyBackground([[.2, 'black'], [.8, 'skyblue']])
const purpleSky = makeSkyBackground([[.2, 'black'], [.9, 'purple']])

const yellowSky = makeSkyBackground([[.1, 'black'], [.5, 'darkgoldenrod'], [.8,'darkgoldenrod'], [.9,'skyblue']])

const stars = new Engine.StarField({
    numberOfStars: 50,
    depth: 1,
    height: 600,
    width: 6000,
})

const sparceStars = new Engine.StarField({
    numberOfStars: 25,
    depth: 1,
    height: 800,
    width: 7000,
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

function makeSiloAndPlatform(relativeX: number, groundLevel: number, worldWidth: number, platformSize:number) {
    const silo =  new MissileSilo({
        fillColor: 'blue', color: 'red',
        x: worldWidth * relativeX,
        y: groundLevel - (siloSize * (.25)) - (platformSize*2),
        size: Math.min(siloSize,platformSize),
        heading: Math.PI
    })

    const platform = new Engine.Body ({
        shape: Engine.shapes.square,
        x: worldWidth * relativeX,
        y: groundLevel - platformSize,
        size: platformSize,
        immobile:true,
        fillColor: 'blue', color: 'red',
    })

    return [silo,platform]
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
            makeBuildingOnGround(1 / 8, 100, 2900, 4000),
            ...makeSiloAndPlatform(2 / 8, 2900, 4000,100),
            makeBuildingOnGround(3 / 8, 80, 2900, 4000),
            makeSiloOnGround(6 / 8, 2900, 4000),
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
            makeBuildingOnGround(1 / 8, 100, 4700, 6000),
            ...makeSiloAndPlatform(2 / 8, 4700, 6000,180),
            makeBuildingOnGround(3 / 8, 80, 4700, 6000),
            makeBuildingOnGround(5 / 8, 80, 4700, 6000),
            ...makeSiloAndPlatform(6 / 8, 4700, 6000,180),
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
    new DefenderGameLevel({
        duration: 1500,
        contents: [
            makeBuildingOnGround(.5 / 8, 100, 4700, 7000),
            makeBuildingOnGround(1 / 8, 100, 4700, 7000),
            makeSiloOnGround(2 / 8, 4700, 7000),
            makeBuildingOnGround(3 / 8, 80, 4700, 7000),
            makeBuildingOnGround(4.5 / 8, 110, 4700, 7000),
            makeBuildingOnGround(5 / 8, 80, 4700, 7000),
            makeSiloOnGround(6 / 8, 4700, 7000),
            makeBuildingOnGround(7.5 / 8, 100, 4700, 7000),
            makeGround(4700, 7000, 'black')
        ],
        height: 5000,
        width: 7000,
        airDensity: .02,
        gravity: .4,
        backgrounds:[yellowSky, sparceStars],
        bombWaveFunction: function (tickCount: number) {
            if (tickCount % 100 == 0) {
                return Math.min(Math.floor(3 + tickCount / 200), 18)
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