import * as Engine from '../../worlds/src/index'
import { Bomb } from './Bomb';
import { createWorld } from './createWorld';
import { MissileSilo } from './MissileSilo';

import './style.css'


interface DefenderGameElements {
    pauseButton?: Element
    resetButton?: Element
    score?: Element
    level?: Element
}

class DefenderGame {
    world: Engine.World
    canvas: HTMLCanvasElement
    viewPort: Engine.ViewPort
    eventHandlers: {
        click: EventListenerOrEventListenerObject
        mousemove: EventListenerOrEventListenerObject
    }
    elements: DefenderGameElements
    tickCount: number
    score: number
    level: number
    status: "PLAY" | "PAUSE" | "GAMEOVER"

    constructor(canvas: HTMLCanvasElement, elements: DefenderGameElements) {
        this.canvas = canvas
        this.elements = elements
        this.eventHandlers = {
            click: null,
            mousemove: null,
        };
        this.handleTick = this.handleTick.bind(this)
        this.handlePoints = this.handlePoints.bind(this)

        if (this.elements.pauseButton) {
            this.elements.pauseButton.addEventListener('click', this.togglePause.bind(this))
        }
        if (this.elements.resetButton) {
            this.elements.resetButton.addEventListener('click', this.reset.bind(this))
        }

        this.setToInitialState()
    }

    setToInitialState() {
        this.world = createWorld()
        this.viewPort = Engine.ViewPort.fitToSize(this.world, this.canvas, 750, 500)

        this.applyEventHandlers()
        this.tickCount = 0
        this.status = "PLAY"
        this.score = 0
        this.level = 1
        this.world.ticksPerSecond = 50
        this.renderScore()
    }

    reset() {
        this.canvas.removeEventListener('click', this.eventHandlers.click)
        this.canvas.removeEventListener('mousemove', this.eventHandlers.mousemove)
        this.world.emitter.off('tick', this.handleTick)
        this.world.emitter.off('points', this.handlePoints)
        this.viewPort.unsetWorld()

        this.setToInitialState()
    }

    applyEventHandlers() {
        let handleClick = function (event: PointerEvent) {
            if (this.status !== 'PLAY') { return }
            const worldPoint = this.viewPort.locateClick(event, false)
            if (!worldPoint) { return }
            this.fireNearestSilo(worldPoint)
        }
        this.eventHandlers.click = handleClick.bind(this);
        this.canvas.addEventListener('click', this.eventHandlers.click)

        let handleMousemove = function (event: PointerEvent) {
            if (this.status !== 'PLAY') { return }
            const worldPoint = this.viewPort.locateClick(event, false)
            if (!worldPoint) { return }
            this.aimSilos(worldPoint)
        }
        this.eventHandlers.mousemove = handleMousemove.bind(this);
        this.canvas.addEventListener('mousemove', this.eventHandlers.mousemove)

        this.world.emitter.on('tick', this.handleTick)
        this.world.emitter.on('points', this.handlePoints)
    }

    togglePause() {
        if (this.status == "PAUSE") {
            this.unpause()
        } else if (this.status == "PLAY") {
            this.pause()
        }
    }

    pause() {
        if (this.status !== "PLAY" || !this.world) { return }
        this.status = "PAUSE"
        this.world.ticksPerSecond = 0
    }

    unpause() {
        if (this.status !== "PAUSE" || !this.world) { return }
        this.status = "PLAY"
        this.world.ticksPerSecond = 50
    }

    renderScore() {
        if (this.elements.score) {
            let scoreString = this.score.toString()
            let leadingZeros = ""

            for (let i = 0; i < 5 - scoreString.length; i++) {
                leadingZeros = leadingZeros + "0"
            }

            this.elements.score.innerHTML = leadingZeros + scoreString
        }
    }

    handlePoints(points: number) {
        this.score += points
        this.renderScore()
    }

    handleTick() {
        if (this.tickCount % 200 == 0) {
            this.addRandomBombs(Math.min(Math.floor(2 + this.tickCount / 400), 15))
        }
        this.tickCount++;

        if (this.elements.level) {
            this.elements.level.innerHTML = this.level.toString()
        }
    }

    aimSilos(target: Engine.Geometry.Point) {
        this.world.bodies.filter(body => body.typeId === "MissileSilo")
            .forEach(silo => {
                if (target.y > silo.shapeValues.top) { return }
                silo.data.heading = Engine.Geometry.getHeadingFromPointToPoint(target, silo.shapeValues)
            })
    }

    fireNearestSilo(target: Engine.Geometry.Point) {
        const closestSilo = this.world.bodies
            .filter(body => body.typeId === "MissileSilo")
            .filter((silo) => !(silo as MissileSilo).data.isDestroyed)
            .sort((siloA, siloB) =>
                Engine.Geometry.getDistanceBetweenPoints(siloA.shapeValues, target) - Engine.Geometry.getDistanceBetweenPoints(siloB.shapeValues, target)
            )[0] as MissileSilo

        if (closestSilo) {
            closestSilo.launchMissle(target)
        }
    }

    addRandomBombs(quantity: number) {
        let x: number, forceDirection: number, forceMagnitude: number, i = 0, size = 30;

        const { _90deg } = Engine.Geometry
        const _45deg = _90deg / 2

        for (i = 0; i < quantity; i++) {
            x = (Math.random() * this.world.width * .8) + this.world.width * .1
            forceDirection = (Math.random() * _90deg) - _45deg
            forceMagnitude = Math.random() * 10
            size = Math.random() > .5 ? 30 : 45
            new Bomb({ x, y: 0, size, density: .1 }, new Engine.Force(forceMagnitude, forceDirection)).enterWorld(this.world)
        }
    }

}

const canvas = document.querySelector('canvas')

const elements: DefenderGameElements = {
    pauseButton: document.querySelector('#pauseButton'),
    resetButton: document.querySelector('#resetButton'),
    score: document.querySelector('#score'),
    level: document.querySelector('#level'),
}


const globalContext = window as any;
globalContext.game = new DefenderGame(canvas, elements);