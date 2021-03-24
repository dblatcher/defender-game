import * as Engine from '../../worlds/src/index'
import { Bomb } from './Bomb'
import { Missile } from './Missle'

import './style.css'


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
    new Engine.Body({
        shape: Engine.shapes.circle,
        fillColor: 'blue',
        x: worldWidth * (1 / 4), y: worldHeight - 100, size: 100,
        elasticity: .1,
        immobile: true,
        renderHeadingIndicator: true,
    }),
    new Engine.Body({
        shape: Engine.shapes.circle,
        fillColor: 'blue',
        x: worldWidth * (3 / 4), y: worldHeight - 100, size: 100,
        elasticity: .1,
        immobile: true,
        renderHeadingIndicator: true,
        heading: Math.PI
    }),
]

function launchMissle(target: Engine.Geometry.Point) {

    const missleLauncher = missleLaunchers.sort((bodyA, bodyB) =>
        Engine.Geometry.getDistanceBetweenPoints(bodyA.shapeValues, target) - Engine.Geometry.getDistanceBetweenPoints(bodyB.shapeValues, target)
    )[0]

    if (target.y > missleLauncher.shapeValues.top) { return }

    const headingFromLauncher = Engine.Geometry.getHeadingFromPointToPoint(target, missleLauncher.shapeValues)
    const startingPoint = Engine.Geometry.translatePoint(missleLauncher.shapeValues, Engine.Geometry.getXYVector(missleLauncher.shapeValues.radius + 10, headingFromLauncher))

    new Missile({
        x: startingPoint.x, y: startingPoint.y,
        heading: headingFromLauncher,
        target,
        thrust: 20000, maxThrust: 20000, density: .2,
        size: 15
    }).enterWorld(world)
}

function addRandomBombs(quantity: number) {
    let x: number, forceDirection: number, forceMagnitude: number, i = 0;

    const { _90deg } = Engine.Geometry
    const _45deg = _90deg / 2

    for (i = 0; i < quantity; i++) {
        x = (Math.random() * worldWidth * .8) + worldWidth * .1
        forceDirection = (Math.random() * _90deg) - _45deg
        forceMagnitude = Math.random() * 10
        new Bomb({ x, y: 0, size: 30, density: .1 }, new Engine.Force(forceMagnitude, forceDirection)).enterWorld(world)
    }
}

const bodies = [
    ...missleLaunchers,
    ground,
    new Bomb({ x: 100, y: 100, size: 30, density: .1 }),
    new Bomb({ x: 600, y: 200, size: 30, density: .1 }, new Engine.Force(30, Engine.Geometry._90deg)),
    new Bomb({ x: 550, y: 100, size: 30, density: .1 }),

]



const world = new Engine.World(bodies, {
    width: worldWidth,
    height: worldHeight,
    globalGravityForce: new Engine.Force(.5, 0),
    gravitationalConstant: .25,
    airDensity: .1,
})

// const viewPort = Engine.ViewPort.full(world, canvas);
const canvas = document.querySelector('canvas')
const viewPort = Engine.ViewPort.fitToSize(world, canvas, 750, 500)


function handleClick(event: PointerEvent) {
    const worldPoint = viewPort.locateClick(event, false)
    if (!worldPoint) { return }
    launchMissle(worldPoint)
}

function handleMousemove(event: PointerEvent) {
    const worldPoint = viewPort.locateClick(event, false)
    if (!worldPoint) { return }

    missleLaunchers.forEach(missleLauncher => {
        if (worldPoint.y > missleLauncher.shapeValues.top) { return }
        missleLauncher.data.heading= Engine.Geometry.getHeadingFromPointToPoint(worldPoint, missleLauncher.shapeValues)
    })
}

let tickCount = 0
function handleTick() {
    tickCount++;

    if (tickCount % 200 == 0) {
        addRandomBombs(Math.floor(1 + tickCount / 500))
    }
}

world.emitter.on('tick', handleTick)
canvas.addEventListener('click', handleClick)
canvas.addEventListener('mousemove', handleMousemove)

world.ticksPerSecond = 50

const globalContext = window as any;
globalContext.world = world;