import { Effect, ViewPort, RenderFunctions, EffectData } from "../../worlds/src";


class SmokeTrail extends Effect {

    constructor(config: EffectData) {
        super(config)
    }

    get typeId() { return "SmokeTrail" }

    tick() {
        Effect.prototype.tick.apply(this,[]);
    }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort) {
        const { x, y, color = 'white', size = 8} = this
        RenderFunctions.renderCircle.onCanvas(ctx, { x, y, radius: size }, { fillColor: color }, viewPort)
    }
}

export { SmokeTrail }