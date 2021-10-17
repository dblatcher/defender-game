import { ViewPort, RenderFunctions, ExpandingRing, ExpandingRingData, Geometry, AbstractGradientFill } from "physics-worlds";
import { Bomb } from "./Bomb";
import { Building } from "./Building";
import { MissileSilo } from "./MissileSilo";




class ExplosionData implements ExpandingRingData {
    x: number
    y: number
    frame?: number
    duration: number
    size: number
    color?: string
    isFromPlayer?: boolean
    fillColor?: string | AbstractGradientFill
}

class Explosion extends ExpandingRing {
    isFromPlayer: boolean
    fillColor: string | AbstractGradientFill

    constructor(data: ExplosionData) {
        super(data)
        this.isFromPlayer = data.isFromPlayer || false
        this.fillColor = data.fillColor || "transparent"
    }

    get typeId() { return "Explosion" }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort) {
        RenderFunctions.renderCircle.onCanvas(ctx, this, { strokeColor: this.color, fillColor: this.fillColor }, viewPort)
    }

    tick() {
        ExpandingRing.prototype.tick.apply(this, [])

        this.world.bodies
            .filter(body => body.typeId == "Bomb")
            .forEach(body => {
                if (Geometry.areCirclesIntersecting(this, body.shapeValues)) {
                    (body as Bomb).explode(this.isFromPlayer);

                    if (this.isFromPlayer) {
                        (body as Bomb).reportPoints(10);
                    }
                }
            })

        if (!this.isFromPlayer) {
            this.world.bodies
                .filter(body => body.typeId == "MissileSilo" || body.typeId == "Building")
                .forEach(siloOrBuilding => {
                    if (Geometry.areCirclesIntersecting(this, siloOrBuilding.shapeValues)) {
                        (siloOrBuilding as MissileSilo | Building).data.isDestroyed = true;
                        this.world.emitter.emit('SFX', { soundName: 'blast' });
                    }
                })
        }
    }
}




export { Explosion, ExplosionData }