import * as Engine from '../../worlds/src/index'
import { Bomb } from './Bomb'
import { MissileSilo } from './MissileSilo'

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
    new MissileSilo({
        fillColor: 'blue', color: 'red',
        x: worldWidth * (1 / 4), y: worldHeight - 150,
        size: 150,
        renderHeadingIndicator: true,
    }),
    new MissileSilo({
        fillColor: 'blue',
        x: worldWidth * (3 / 4), y: worldHeight - 150,
        size: 150,
        renderHeadingIndicator: true,
    }),
]



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
    const target = viewPort.locateClick(event, false)
    if (!target) { return }

    const closestSilo = world.bodies.filter(body => body.typeId === "MissileSilo")
    .sort((siloA, siloB) =>
        Engine.Geometry.getDistanceBetweenPoints(siloA.shapeValues, target) - Engine.Geometry.getDistanceBetweenPoints(siloB.shapeValues, target)
    )[0] as MissileSilo

    closestSilo.launchMissle(target)
}

function handleMousemove(event: PointerEvent) {
    const worldPoint = viewPort.locateClick(event, false)
    if (!worldPoint) { return }

    world.bodies.filter(body => body.typeId === "MissileSilo")
        .forEach(silo => {
            if (worldPoint.y > silo.shapeValues.top) { return }
            silo.data.heading = Engine.Geometry.getHeadingFromPointToPoint(worldPoint, silo.shapeValues)
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