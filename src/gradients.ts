import { RadialGradientFill, Geometry, LinearGradientFill, ViewPort, BackGround, RenderFunctions } from "physics-worlds";

const redExplosionGradient = new RadialGradientFill({
    fallbackColor: "transparent",
    canvasFunction: (ctx: CanvasRenderingContext2D, circle: Geometry.Circle, heading: number) => {

        const innerCircle: Geometry.Circle = {
            x: circle.x,
            y: circle.y,
            radius: circle.radius * (1 / 3)
        }

        const gradient = ctx.createRadialGradient(innerCircle.x, innerCircle.y, innerCircle.radius, circle.x, circle.y, circle.radius);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(.1, 'white');
        gradient.addColorStop(.2, 'yellow');
        gradient.addColorStop(1, 'red');

        return gradient;
    }
})

const blueExplosionGradient = new RadialGradientFill({
    fallbackColor: "transparent",
    canvasFunction: (ctx: CanvasRenderingContext2D, circle: Geometry.Circle, heading: number) => {

        const innerCircle: Geometry.Circle = {
            x: circle.x,
            y: circle.y,
            radius: circle.radius * (1 / 3)
        }

        const gradient = ctx.createRadialGradient(innerCircle.x, innerCircle.y, innerCircle.radius, circle.x, circle.y, circle.radius);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(.1, 'white');
        gradient.addColorStop(.3, 'blue');
        gradient.addColorStop(1, 'cyan');

        return gradient;
    }
})


function makeSkyBackground(colorStops: [number, string][]) {

    const linearGradientFill = new LinearGradientFill({
        fallbackColor: colorStops[colorStops.length - 1][1],
        canvasFunction: (ctx: CanvasRenderingContext2D, line: [Geometry.Point, Geometry.Point]) => {
            const gradient = ctx.createLinearGradient(line[0].x, line[0].y, line[1].x, line[1].y);
            colorStops.forEach(colorStop => {
                gradient.addColorStop(...colorStop)
            })
            return gradient
        }
    })

    let backGround = new BackGround();
    backGround.renderOnCanvas = function (ctx: CanvasRenderingContext2D, viewPort: ViewPort) {
        RenderFunctions.renderPolygon.onCanvas(ctx, viewPort.worldCorners, { fillColor: linearGradientFill }, viewPort)
    }

    return backGround
}




export { redExplosionGradient, blueExplosionGradient, makeSkyBackground }