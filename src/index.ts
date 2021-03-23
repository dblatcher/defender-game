import * as Engine from '../../worlds/src/index'
import { Explosion } from './Explosion'
import { Bomb } from './Bomb'

import './style.css'

const bodies = [
    new Bomb({ x: 100, y: 100, size: 50 }),
    new Bomb({ x: 600, y: 100, size: 50 }),
    new Bomb({ x: 550, y: 100, size: 50 }),
]

const canvas = document.querySelector('canvas')

const world = new Engine.World([...bodies], {
    width: 1500,
    height: 1000,
    globalGravityForce: new Engine.Force(1, 0),
    gravitationalConstant: .1,
})

// const viewPort = Engine.ViewPort.full(world, canvas);
const viewPort = Engine.ViewPort.fitToSize(world, canvas, 750, 500)




function handleClick(event: PointerEvent) {
    const worldPoint = viewPort.locateClick(event, false)
    if (!worldPoint) { return }

    new Explosion({ x: worldPoint.x, y: worldPoint.y, size: 100, duration: 30, color: 'white' }).enterWorld(world)
}

canvas.addEventListener('click', handleClick)

world.ticksPerSecond = 20

const globalContext = window as any;
globalContext.world = world;