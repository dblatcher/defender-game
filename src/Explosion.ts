import { AbstractGradientFill, Body, BodyData, Effect, EffectData, ExpandingRing, Geometry, Shape, shapes } from "../../worlds/src";
import { CollisionReport } from "../../worlds/src/collisionDetection";
import { ExpandingRingData } from "../../worlds/src/Effect";
import { Circle } from "../../worlds/src/geometry";


class ExplosionData implements ExpandingRingData {
    x: number
    y: number
    frame?: number
    duration: number
    size: number
    color?: string
}

class Explosion extends ExpandingRing {
    data: ExplosionData

    constructor(data: ExplosionData) {
        super(data)
    }


    tick() {
        ExpandingRing.prototype.tick.apply(this, [])

        this.world.bodies.forEach(body => {
            if (Geometry.areCirclesIntersecting(this, body.shapeValues)) {
                body.leaveWorld()
                new ExpandingRing({ x: body.data.x, y: body.data.y, size: 50, duration: 20 }).enterWorld(this.world)

                // can create new explosion to detonate chain reactions!
            }
        })
    }
}




export { Explosion, ExplosionData }