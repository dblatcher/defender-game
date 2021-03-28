import { RadialGradientFill, Geometry } from "../../worlds/src";

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

export { redExplosionGradient, blueExplosionGradient }