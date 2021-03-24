import { CollisionDetection, Body } from "../../worlds/src";
import { Explosion } from "./Explosion";
import { Missile } from "./Missle";



class Bomb extends Body {

    get typeId() { return "Bomb" }


    handleCollision(report: CollisionDetection.CollisionReport) {
        const otherThing = report.item1 === this ? report.item2 : report.item1
        if (otherThing.typeId !== 'Bomb') {
            this.explode();
            (otherThing as Missile).explode;
        } else {
            Body.prototype.handleCollision(report)
        }
    }

    explode() {
        this.leaveWorld()
        new Explosion({ x: this.data.x, y: this.data.y, size: 150, duration: 15, color: "darkorange" }).enterWorld(this.world)
    }
}

export { Bomb }