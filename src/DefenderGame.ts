import * as Engine from '../../worlds/src/index'
import { Bomb } from './Bomb';
import { Building } from './Building';
import { createWorldFromLevel, levels } from './createWorld';
import { MissileSilo } from './MissileSilo';

interface DefenderGameElements {
    pauseButton?: Element
    resetButton?: Element
    score?: Element
    level?: Element
    caption?: HTMLElement
}

class DefenderGame {
    world: Engine.World
    canvas: HTMLCanvasElement
    viewPort: Engine.ViewPort
    frameFill?: string
    elements: DefenderGameElements
    tickCount: number
    score: number
    levelNumber: number
    soundPlayer: Engine.SoundPlayer
    status: "PLAY" | "PAUSE" | "GAMEOVER" | "PRELEVEL" | "POSTLEVEL"

    constructor(canvas: HTMLCanvasElement, elements: DefenderGameElements, config: { frameFill?: string, soundPlayer?: Engine.SoundPlayer } = {}) {
        this.canvas = canvas
        this.elements = elements
        this.handleClick = this.handleClick.bind(this)
        this.handleMousemove = this.handleMousemove.bind(this)
        this.handleTick = this.handleTick.bind(this)
        this.handlePoints = this.handlePoints.bind(this)
        this.playSound = this.playSound.bind(this)

        this.frameFill = config.frameFill || 'white';
        this.soundPlayer = config.soundPlayer || null;

        if (this.elements.pauseButton) {
            this.elements.pauseButton.addEventListener('click', this.togglePause.bind(this))
        }
        if (this.elements.resetButton) {
            this.elements.resetButton.addEventListener('click', this.reset.bind(this))
        }

        this.score = 0
        this.levelNumber = 1
        this.setStatusPrelevel()
    }

    get currentLevel() {
        return levels[this.levelNumber - 1]
    }

    get currentLevelIsFinished() {
        if (!this.world) { return false }
        const areBombs = this.world.bodies.find(body => body.typeId === "Bomb");
        const areExplosions = this.world.effects.find(effect => effect.typeId === "Explosion");

        return this.status === "PLAY" && !areBombs && !areExplosions && this.tickCount > this.currentLevel.duration
    }

    get playerHasLost() {
        if (!this.world) { return false }
        const areWorkingSilos = this.world.bodies.find(body => body.typeId === "MissileSilo" && !(body as MissileSilo).data.isDestroyed)
        const areSurvivingBuildings = this.world.bodies.find(body => body.typeId === "Building" && !(body as Building).data.isDestroyed)

        return this.status === "PLAY" && (!areWorkingSilos || !areSurvivingBuildings)
    }

    reset() {
        this.removeEventHandlers()
        if (this.viewPort.world) { this.viewPort.unsetWorld() }
        this.score = 0
        this.levelNumber = 1
        this.setStatusPrelevel()
    }

    setStatusPlay() {
        this.status = "PLAY"
        this.setCaption();
        this.playSound({ soundName: 'alarm', config: {volume:.25} });
    }

    setStatusGameOver() {
        this.status = "GAMEOVER"
        this.setCaption("GAME OVER")
    }

    setStatusPostlevel() {
        const survivingBuildings = this.world.bodies.filter(
            body => body.typeId === "Building" && (body as Building).data.isDestroyed === false
        ) as Building[];

        const buildingScore = survivingBuildings.reduce((score, building) => { return score + building.scoreValue }, 0)
        this.handlePoints(buildingScore)

        this.status = "POSTLEVEL"
        this.setCaption(`
        <p>Level ${this.levelNumber} cleared</p> 
        <p>${survivingBuildings.length}x buildings left: ${buildingScore} points</p> 
        <p></p>
        `)
    }

    setStatusPrelevel() {
        this.tickCount = -1

        this.world = createWorldFromLevel(this.currentLevel)
        this.viewPort = Engine.ViewPort.fitToSize(this.world, this.canvas, 750, 500)
        this.viewPort.framefill = this.frameFill

        this.applyEventHandlers()
        this.world.ticksPerSecond = 50
        this.renderScore()
        if (this.elements.level) {
            this.elements.level.innerHTML = this.levelNumber.toString()
        }
        this.status = "PRELEVEL"
        this.setCaption(`
        <p>Level ${this.levelNumber}</p> 
        <p>Gravity ${this.currentLevel.gravity}g</p>
        <p>Atmosphere ${this.currentLevel.airDensity}</p>
        `);
    }

    setStatusPause() {
        if (this.status !== "PLAY" || !this.world) { return }
        this.status = "PAUSE"
        this.setCaption("paused")
        this.world.ticksPerSecond = 0
    }

    unpauseGame() {
        if (this.status !== "PAUSE" || !this.world) { return }
        this.setStatusPlay()
        this.world.ticksPerSecond = 50
    }

    goToNextLevel() {
        if (this.levelNumber < levels.length) { this.levelNumber++ }
        else { this.levelNumber = 1 }
        this.removeEventHandlers()
        if (this.viewPort.world) { this.viewPort.unsetWorld() }
        this.setStatusPrelevel()
    }

    applyEventHandlers() {
        this.canvas.addEventListener('click', this.handleClick)
        this.canvas.addEventListener('mousemove', this.handleMousemove)

        this.world.emitter.on('tick', this.handleTick)
        this.world.emitter.on('points', this.handlePoints)

        this.world.emitter.on('SFX', this.playSound)
    }

    removeEventHandlers() {
        this.canvas.removeEventListener('click', this.handleClick)
        this.canvas.removeEventListener('mousemove', this.handleMousemove)
        this.world.emitter.off('tick', this.handleTick)
        this.world.emitter.off('points', this.handlePoints)
        this.world.emitter.off('SFX', this.playSound)
    }

    togglePause() {
        if (this.status == "PAUSE") {
            this.unpauseGame()
        } else if (this.status == "PLAY") {
            this.setStatusPause()
        }
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

    handleClick(event: PointerEvent) {
        const worldPoint = this.viewPort.locateClick(event, false)
        if (!worldPoint) { return }

        switch (this.status) {
            case 'PLAY': return this.fireNearestSilo(worldPoint);
            case 'PAUSE': return this.unpauseGame();
            case 'GAMEOVER': return this.reset();
            case 'PRELEVEL': return this.setStatusPlay();
            case 'POSTLEVEL': return this.goToNextLevel();
        }
    }

    handleMousemove(event: PointerEvent) {
        if (this.status !== 'PLAY') { return }
        const worldPoint = this.viewPort.locateClick(event, false)
        if (!worldPoint) { return }
        this.aimSilos(worldPoint)
    }

    setCaption(content: string = "") {
        if (!this.elements.caption) { return }
        this.elements.caption.innerHTML = content;
        this.elements.caption.style.display = !content ? "none" : "";
    }

    handleTick() {

        if (this.tickCount <= this.currentLevel.duration && this.tickCount >= 0) {
            const bombsToAdd = this.currentLevel.bombWaveFunction(this.tickCount)
            this.addRandomBombs(bombsToAdd)
        }

        if (this.playerHasLost && this.status == "PLAY") {
            this.setStatusGameOver()
        }

        if (this.currentLevelIsFinished && !this.playerHasLost && this.status == "PLAY") {
            return this.setStatusPostlevel()
        }

        if (this.status == "PLAY") {
            this.tickCount++;
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

        // don't let player keep firing after the bombs are gone - the explosions stop the level from being over
        const areBombs = this.world.bodies.find(body => body.typeId === "Bomb");
        if (!areBombs && this.tickCount > this.currentLevel.duration) { return }

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

    playSound(payload: { soundName: string, config: any }) {
        if (!this.soundPlayer) { return }
        this.soundPlayer.play(payload.soundName, payload.config);
    }
}

export { DefenderGame, DefenderGameElements }