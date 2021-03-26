import * as Engine from '../../worlds/src/index'
import { Bomb } from './Bomb'
import { Building } from './Building'
import { MissileSilo } from './MissileSilo'


function createWorld() {

    const worldWidth = 4000
    const worldHeight = 3000

    const ground = new Engine.Body({
        shape: Engine.shapes.square,
        x: worldWidth / 2, y: worldHeight - 100 + worldWidth / 2, size: worldWidth / 2,
        elasticity: .1,
        immobile: true,
        fillColor: 'brown',
        heading: Math.PI
    })

    const missleLaunchers = [
        new MissileSilo({
            fillColor: 'blue', color: 'red',
            x: worldWidth * (1 / 4), y: worldHeight - 150,
            size: 150,
            heading: Math.PI
        }),
        new MissileSilo({
            fillColor: 'blue',
            x: worldWidth * (3 / 4), y: worldHeight - 150,
            size: 150,
            heading: Math.PI,
        }),
    ]

    const buildings = [
        new Building({
            size: 100,
            y: worldHeight - 200,
            x: worldWidth * (1 / 8),
            fillColor: 'grey',
            color: 'White',
        }),
        new Building({
            size: 75,
            y: worldHeight - 150,
            x: worldWidth * (3/ 8),
            fillColor: 'grey',
            color: 'White',
        }),
        new Building({
            size: 100,
            y: worldHeight - 200,
            x: worldWidth * (7.5 / 8),
            fillColor: 'grey',
            color: 'White',
        }),
    ]

    const world = new Engine.World([
        ...missleLaunchers,
        ...buildings,
        ground,
    ], {
        width: worldWidth,
        height: worldHeight,
        globalGravityForce: new Engine.Force(.5, 0),
        gravitationalConstant: .25,
        airDensity: .1,
    })

    return world
}


export { createWorld }