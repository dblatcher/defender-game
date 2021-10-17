import { AbstractGradientFill, Body, BodyData, RenderFunctions, Shape, shapes, ViewPort, Geometry } from "physics-worlds";

class BuildingData implements BodyData {
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
    immobile?: boolean
    renderHeadingIndicator?: boolean
    renderPathAhead?: boolean

    isDestroyed?: boolean
    ruinPatterIndex?: number
    buildingPatternIndex?: number
}

class Building extends (Body) {
    data: BuildingData

    constructor(data: BuildingData) {
        super(data)
        this.data.immobile = true
        this.data.shape = shapes.square
        this.data.isDestroyed = data.isDestroyed || false
        this.data.ruinPatterIndex = data.ruinPatterIndex || Math.floor(Math.random() * Building.ruinPatterns.length)
        this.data.buildingPatternIndex = data.buildingPatternIndex || Math.floor(Math.random() * Building.buildingPatterns.length)
    }

    get typeId() { return "Building" }

    get scoreValue() {return 100}

    get ruinPolygon(): Geometry.Point[] {
        const { top, left, radius } = this.shapeValues;
        return Building.ruinPatterns[this.data.ruinPatterIndex]
            .map(coord => {
                return {
                    x: left + radius * coord[0], y: top + radius * coord[1]
                }
            });
    }

    get buildingPolygon(): Geometry.Point[] {
        const { top, left, radius } = this.shapeValues;
        return Building.buildingPatterns[this.data.buildingPatternIndex]
            .map(coord => {
                return {
                    x: left + radius * coord[0], y: top + radius * coord[1]
                }
            });
    }

    renderOnCanvas(ctx: CanvasRenderingContext2D, viewPort: ViewPort) {
        if (!this.data.isDestroyed) {
            this.data.shape.renderOnCanvas(ctx, this, viewPort);
            RenderFunctions.renderPolygon.onCanvas(ctx, this.buildingPolygon, {
                fillColor: this.data.fillColor, strokeColor: this.data.color
            }, viewPort)
        } else {
            RenderFunctions.renderPolygon.onCanvas(ctx, this.ruinPolygon, {
                fillColor: this.data.fillColor, strokeColor: this.data.color
            }, viewPort)
        }
    }

    static get ruinPatterns() {
        return [
            [
                [0, 2], [0, 0], [.3, 0], [.5, 1.4], [.6, 1.3], [.7, 0.6], [1.2, 0.4], [1.8, 0.1], [2, 0.1], [2, 2],
            ],
            [
                [0, 2], [0, 1.5], [.3, 1.8], [.6, 1.8], [.6, 1.3], [1.1, 1.6], [1.7, 0.4], [1.8, 0.4], [2, 0.1], [2, 2],
            ],
        ]
    }

    static get buildingPatterns() {
        return [
            [
                [.2, .2], [1.8, .2], [1.8, .5], [.2, .5]
            ],
            [
                [1.2, 1.5], [.2, 1.5],[.2, 1], [1.2, 1], 
            ],
            [
                [1,.5],[1,1.5],[1.5,1.5],[1.5,1],[.5,1],[.5,.5]
            ],
        ]
    }


}

export { Building }