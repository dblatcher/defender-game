import { CollisionDetection, Body, RenderFunctions, ViewPort, Geometry, BodyData, Force } from "../../worlds/src";
import { Explosion } from "./Explosion";
import { Missile } from "./Missle";

import { redExplosionGradient, blueExplosionGradient } from './gradients'
import { getXYVector, reverseHeading, translatePoint } from "../../worlds/src/geometry";

class Bomb extends Body {

    get typeId() { return "Bomb" }

    constructor(data: BodyData, force: Force = null) {
        super(data, force)
        this.data.headingFollowsDirection = true
    }

    handleCollision(report: CollisionDetection.CollisionReport) {
        const otherThing = report.item1 === this ? report.item2 : report.item1
        if (otherThing.typeId !== 'Bomb') {
            this.explode();

            if (otherThing.typeId === 'Missile') {
                (otherThing as Missile).explode;
                this.reportPoints(10)
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
            size: 150,
            duration: 15,
            color: explosionIsFromPlayer ? "red" : "darkorange",
            fillColor: explosionIsFromPlayer ? redExplosionGradient : blueExplosionGradient,
            isFromPlayer: explosionIsFromPlayer
        }).enterWorld(this.world)
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

        RenderFunctions.renderCircle.onCanvas(ctx, shapeValues, {
            fillColor: 'crimson',
            strokeColor: 'white'
        }, viewPort);

        const midLeft = translatePoint(shapeValues, getXYVector(size, heading + Geometry._90deg));
        const backLeft = translatePoint(midLeft, getXYVector(size, reverseHeading(heading)));
        const midRight = translatePoint(shapeValues, getXYVector(size, heading - Geometry._90deg));
        const backRight = translatePoint(midRight, getXYVector(size, reverseHeading(heading)));

        RenderFunctions.renderPolygon.onCanvas(ctx, [midLeft, backLeft, backRight, midRight], {
            fillColor: 'gray',
            strokeColor: 'white'
        }, viewPort)

    }
}

export { Bomb }