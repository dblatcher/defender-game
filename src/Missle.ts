import { Body, Force, BodyData, Shape, Geometry, RenderFunctions, CollisionDetection, ViewPort, ExpandingRing } from '../../worlds/src/index'
import { Bomb } from './Bomb'
import { Explosion } from './Explosion'
import { redExplosionGradient } from './gradients'
import { SmokeTrail } from './smokeTrail'

const { getVectorX, getVectorY, reverseHeading } = Geometry

class MissileData implements BodyData {
    x: number
    y: number
    heading?: number
    size?: number
    color?: string
    density?: number
    shape?: Shape
    elasticity?: number

    headingFollowsDirection?: true
    fillColor?: string
    thrust?: number
    maxThrust?: number
    target?: Geometry.Point

    hasExplodedAlready?: boolean;
    explosionSize?: number
    explosionDuration?: number
}

class Missile extends Body {
    data: MissileData
    positionLastTick: Geometry.Point
    constructor(config: MissileData, momentum: Force = null) {
        super(config, momentum);
        this.data.color = config.color || 'red'
        this.data.fillColor = config.fillColor || 'white'
        this.data.thrust = config.thrust || 0
        this.data.maxThrust = config.maxThrust || 100
        this.data.target = config.target || null
        this.data.hasExplodedAlready = config.hasExplodedAlready || false
        this.data.explosionDuration = config.explosionDuration || 10
        this.data.explosionSize = config.explosionSize || 100

        this.positionLastTick = {
            x: this.data.x,
            y: this.data.y
        }
    }

    get typeId() { return 'Missile' }

    tick() {

        if (this.world) {
            new SmokeTrail({
                x: this.positionLastTick.x,
                y: this.positionLastTick.y,
                duration: 6,
            }).enterWorld(this.world)
        }

        this.positionLastTick.x = this.data.x;
        this.positionLastTick.y = this.data.y;

        if (this.shapeValues.y < this.data.target.y) {
            this.explode()
        }
    }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort) {

        const { x, y, size, heading, color, fillColor, thrust, maxThrust } = this.data

        let frontPoint = {
            x: x + getVectorX(size, heading),
            y: y + getVectorY(size, heading)
        }

        const backSideAngle = Math.PI * .75

        let backLeftPoint = {
            x: x + getVectorX(size, heading - backSideAngle),
            y: y + getVectorY(size, heading - backSideAngle)
        }
        let backRightPoint = {
            x: x + getVectorX(size, heading + backSideAngle),
            y: y + getVectorY(size, heading + backSideAngle)
        }

        RenderFunctions.renderPolygon.onCanvas(ctx, [frontPoint, backLeftPoint, backRightPoint], { strokeColor: color, fillColor }, viewPort)


        if (thrust > 0) {
            let backPoint = {
                x: x - getVectorX(size, heading),
                y: y - getVectorY(size, heading)
            }

            let flicker = (Math.random() - .5) * .5
            let flameEndPoint = {
                x: backPoint.x + getVectorX(size * (thrust / maxThrust) * 2, reverseHeading(heading + flicker)),
                y: backPoint.y + getVectorY(size * (thrust / maxThrust) * 2, reverseHeading(heading + flicker))
            }

            RenderFunctions.renderPolygon.onCanvas(ctx, [backRightPoint, flameEndPoint, backLeftPoint], { strokeColor: 'blue', fillColor: 'green' }, viewPort)
        }
    }

    changeThrottle(change: number) {
        let newAmount = this.data.thrust + change
        if (newAmount < 0) { newAmount = 0 }
        if (newAmount > this.data.maxThrust) { newAmount = this.data.maxThrust }
        this.data.thrust = newAmount
    }

    updateMomentum() {
        Body.prototype.updateMomentum.apply(this, [])
        const { thrust, heading } = this.data
        const thrustForce = new Force(thrust / this.mass, heading)
        this.momentum = Force.combine([this.momentum, thrustForce])
    }

    explode() {

        const { hasExplodedAlready, explosionSize, explosionDuration, x, y, } = this.data

        if (hasExplodedAlready) { return }
        this.leaveWorld()
        this.data.hasExplodedAlready = true
        new Explosion({
            x, y,
            duration: explosionDuration,
            size: explosionSize,
            color: 'red',
            fillColor: redExplosionGradient,
            isFromPlayer: true,
        }).enterWorld(this.world);
        this.world.emitter.emit('SFX', { soundName: 'boom' });
    }

    handleCollision(report: CollisionDetection.CollisionReport) {
        const otherThing = report.item1 === this ? report.item2 : report.item1
        if (otherThing.typeId === 'Bomb') {
            this.explode();
            (otherThing as Bomb).explode;
        } else {
            Body.prototype.handleCollision(report)
        }
    }

}

export { Missile, MissileData }