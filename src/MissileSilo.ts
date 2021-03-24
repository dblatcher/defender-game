import { Body, BodyData, Shape, AbstractGradientFill, ViewPort, shapes, RenderFunctions, Geometry } from "../../worlds/src";
import { Missile } from "./Missle";


class MissileSiloData implements BodyData {
    x: number
    y: number
    heading?: number
    size?: number
    headingFollowsDirection?: boolean
    shape?: Shape
    color?: string
    fillColor?: string | AbstractGradientFill
    density?: number
    elasticity?: number
    immobile?: true

    renderHeadingIndicator?: boolean
    renderPathAhead?: boolean
    isDestroyed?: boolean
}

class MissileSilo extends Body {
    data: MissileSiloData

    constructor(data: MissileSiloData) {
        super(data)
        this.data.shape = shapes.circle
        this.data.elasticity = .1
        this.data.immobile = true
        this.data.isDestroyed = data.isDestroyed || false
    }

    get typeId() { return "MissileSilo" }

    launchMissle(target: Geometry.Point) {

        if (target.y > this.shapeValues.top) { return }

        const headingFromLauncher = Geometry.getHeadingFromPointToPoint(target, this.shapeValues)
        const startingPoint = Geometry.translatePoint(this.shapeValues, Geometry.getXYVector(this.shapeValues.radius + 10, headingFromLauncher))

        new Missile({
            x: startingPoint.x, y: startingPoint.y,
            heading: headingFromLauncher,
            target,
            explosionDuration: 20,
            explosionSize: 200,
            thrust: 20000, maxThrust: 20000, density: .2,
            size: 15
        }).enterWorld(this.world)
    }


    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort) {
        const { shapeValues, data } = this
        const { x, y, radius } = shapeValues

        const base: Geometry.Point[] = [
            { x: x - radius, y: y + (radius * 1 / 4) },
            { x: x + radius, y: y + (radius * 1 / 4) },
            { x: x + radius, y: y },
            { x: x + (radius * 1 / 3), y: y - (radius * 1 / 4) },
            { x: x - (radius * 1 / 3), y: y - (radius * 1 / 4) },
            { x: x - radius, y: y },
        ]

        if (!data.isDestroyed) {
            const barrel: [Geometry.Point, Geometry.Point] = [
                shapeValues,
                Geometry.translatePoint(shapeValues, Geometry.getXYVector(radius, data.heading))
            ]
            const breach: Geometry.Circle = {
                x: barrel[1].x,
                y: barrel[1].y,
                radius: radius * (1 / 8)
            }
            RenderFunctions.renderLine.onCanvas(ctx, barrel, { strokeColor: "white", lineWidth: 4 }, viewPort)
            RenderFunctions.renderCircle.onCanvas(ctx, breach, { strokeColor: "white" }, viewPort)
        }

        RenderFunctions.renderPolygon.onCanvas(ctx, base, { strokeColor: data.color, fillColor: data.fillColor }, viewPort)
    }

}


export { MissileSilo, MissileSiloData }