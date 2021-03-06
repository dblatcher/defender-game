import { CollisionDetection, Body, RenderFunctions, ViewPort, Geometry, BodyData, Force } from "physics-worlds";
import { Explosion } from "./Explosion";
import { Missile } from "./Missle";

import { redExplosionGradient, blueExplosionGradient } from './gradients'
const { getXYVector, reverseHeading, translatePoint, _90deg } = Geometry;

class Bomb extends Body {

    get typeId() { return "Bomb" }

    constructor(data: BodyData, force: Force = null) {
        super(data, force)
        this.data.headingFollowsDirection = true
    }

    get scoreValue() { return 10 }

    handleCollision(report: CollisionDetection.CollisionReport) {
        const otherThing = report.item1 === this ? report.item2 : report.item1
        if (otherThing.typeId !== 'Bomb') {
            this.explode();

            if (otherThing.typeId === 'Missile') {
                (otherThing as Missile).explode;
                this.reportPoints(this.scoreValue)
            }
        } else {
            Body.prototype.handleCollision(report)
        }
    }

    explode(explosionIsFromPlayer = false) {
        this.leaveWorld()
        new Explosion({
            x: this.data.x,
            y: this.data.y,
            size: explosionIsFromPlayer ? 250 : 150,
            duration: explosionIsFromPlayer ? 25 : 15,
            color: explosionIsFromPlayer ? "blue" : "darkorange",
            fillColor: explosionIsFromPlayer ?  blueExplosionGradient : redExplosionGradient,
            isFromPlayer: explosionIsFromPlayer
        }).enterWorld(this.world);
        this.world.emitter.emit('SFX', { soundName: 'boom' });
    }

    reportPoints(quantity: number) {
        if (!this.world) { return }
        this.world.emitter.emit('points', quantity)
    }

    move() {
        Body.prototype.move.apply(this, [])

        if (this.data.y > this.world.height + 200) {
            this.leaveWorld()
        }
    }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort) {

        const { shapeValues } = this
        const { heading, size } = this.data

        const tailWidth = size * (6 / 10)
        const tailLength = size * (20 / 10)

        const mid = translatePoint(shapeValues, getXYVector(size + tailWidth, reverseHeading(heading)));

        const midLeft = translatePoint(shapeValues, getXYVector(tailWidth / 2, heading + Geometry._90deg));
        const backLeft = translatePoint(translatePoint(midLeft, getXYVector(tailLength, reverseHeading(heading))), getXYVector(tailWidth, heading + Geometry._90deg));
        const midRight = translatePoint(shapeValues, getXYVector(tailWidth / 2, heading - Geometry._90deg));
        const backRight = translatePoint(translatePoint(midRight, getXYVector(tailLength, reverseHeading(heading))), getXYVector(tailWidth, heading - Geometry._90deg));

        RenderFunctions.renderPolygon.onCanvas(ctx, [midLeft, backLeft, mid, backRight, midRight], {
            fillColor: 'gray',
            strokeColor: 'white'
        }, viewPort)
        RenderFunctions.renderWedge.onCanvas(ctx, Object.assign({ heading, angle: _90deg * 2 }, shapeValues), {
            fillColor: 'crimson',
            strokeColor: 'white'
        }, viewPort);
        RenderFunctions.renderWedge.onCanvas(ctx, Object.assign({ heading: reverseHeading(heading), angle: _90deg * 2 }, shapeValues), {
            fillColor: 'gray',
            strokeColor: 'white'
        }, viewPort);
    }
}

export { Bomb }