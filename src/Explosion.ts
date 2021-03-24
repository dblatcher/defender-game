import { AbstractGradientFill, Body, BodyData, Effect, EffectData, ExpandingRing, Geometry, Shape, shapes } from "../../worlds/src";
import { ExpandingRingData } from "../../worlds/src/Effect";
import { Bomb } from "./Bomb";
import { MissileSilo } from "./MissileSilo";


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

        this.world.bodies
            .filter(body => body.typeId == "Bomb")
            .forEach(body => {
                if (Geometry.areCirclesIntersecting(this, body.shapeValues)) {
                    (body as Bomb).explode();
                }
            })

        this.world.bodies
            .filter(body => body.typeId == "MissileSilo")
            .forEach(silo => {
                if (Geometry.areCirclesIntersecting(this, silo.shapeValues)) {
                    (silo as MissileSilo).data.isDestroyed = true;
                }
            })
    }
}




export { Explosion, ExplosionData }