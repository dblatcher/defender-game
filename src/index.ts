import * as Engine from '../../worlds/src/index'
import { Explosion } from './Explosion'
import { Bomb } from './Bomb'

import './style.css'
import { Missile } from './Missle'

const worldWidth = 1500
const worldHeight = 1000


const ground = new Engine.Body({
    shape: Engine.shapes.square,
    x: worldWidth / 2, y: worldHeight - 100 + worldWidth / 2, size: worldWidth / 2,
    elasticity: .1,
    immobile: true,
    fillColor: 'brown',
})

const missleLauncher = new Engine.Body({
    shape: Engine.shapes.circle,
    fillColor: 'blue',
    x: worldWidth / 2, y: worldHeight - 100, size: 100,
    elasticity: .1,
    immobile: true,
})

function launchMissle(target: Engine.Geometry.Point) {

    if (target.y > missleLauncher.shapeValues.top) {return}

    const headingFromLauncher = Engine.Geometry.getHeadingFromPointToPoint(target,  missleLauncher.shapeValues)
    const startingPoint = Engine.Geometry.translatePoint(missleLauncher.shapeValues, Engine.Geometry.getXYVector(missleLauncher.shapeValues.radius*1.5, headingFromLauncher))

    new Missile({
        x: startingPoint.x, y: startingPoint.y,
        heading: headingFromLauncher,
        target,
        thrust: 20000, maxThrust: 20000, density: .2,
        size: 15
    }).enterWorld(world)

}

const bodies = [
    missleLauncher,
    ground,
    new Bomb({ x: 100, y: 100, size: 20 }),
    new Bomb({ x: 600, y: 100, size: 20 }),
    new Bomb({ x: 550, y: 100, size: 20 }),


]



const world = new Engine.World([...bodies], {
    width: worldWidth,
    height: worldHeight,
    globalGravityForce: new Engine.Force(1, 0),
    gravitationalConstant: .5,
    airDensity: 1,
})

// const viewPort = Engine.ViewPort.full(world, canvas);
const canvas = document.querySelector('canvas')
const viewPort = Engine.ViewPort.fitToSize(world, canvas, 750, 500)




function handleClick(event: PointerEvent) {
    const worldPoint = viewPort.locateClick(event, false)
    if (!worldPoint) { return }

    // new Explosion({ x: worldPoint.x, y: worldPoint.y, size: 100, duration: 30, color: 'white' }).enterWorld(world)
    launchMissle(worldPoint)
}

canvas.addEventListener('click', handleClick)

world.ticksPerSecond = 50

const globalContext = window as any;
globalContext.world = world;