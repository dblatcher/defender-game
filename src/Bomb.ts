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

        const tailWidth = size * (6/10)
        const tailLength = size * (20/10)

        const left = translatePoint(shapeValues, getXYVector(size, heading + Geometry._90deg));
        const right = translatePoint(shapeValues, getXYVector(size, heading - Geometry._90deg));

        const mid = translatePoint(shapeValues, getXYVector(size+tailWidth, reverseHeading(heading)));

        const midLeft = translatePoint(shapeValues, getXYVector(tailWidth/2, heading + Geometry._90deg));
        const backLeft = translatePoint(translatePoint(midLeft, getXYVector(tailLength, reverseHeading(heading))), getXYVector(tailWidth, heading + Geometry._90deg));
        const midRight = translatePoint(shapeValues, getXYVector(tailWidth/2, heading - Geometry._90deg));
        const backRight = translatePoint( translatePoint(midRight, getXYVector(tailLength, reverseHeading(heading))), getXYVector(tailWidth, heading - Geometry._90deg));

        RenderFunctions.renderPolygon.onCanvas(ctx, [midLeft, backLeft,mid, backRight, midRight], {
            fillColor: 'gray',
            strokeColor: 'white'
        }, viewPort)
        RenderFunctions.renderCircle.onCanvas(ctx, shapeValues, {
            fillColor: 'crimson',
            strokeColor: 'white'
        }, viewPort);

        RenderFunctions.renderLine.onCanvas(ctx, [left,right], {
            fillColor: 'crimson',
            strokeColor: 'white',
            lineWidth:2,
            lineDash:[1,1],
        }, viewPort);


    }
}

export { Bomb }