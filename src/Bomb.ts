import { CollisionDetection, Body, ExpandingRing} from "../../worlds/src";
import { Missile } from "./Missle";



class Bomb extends Body {

    get typeId() {return "Bomb"}


    handleCollision(report: CollisionDetection.CollisionReport) {
        if (report) {
            const otherThing = report.item1 === this ? report.item2 : report.item1
            if (otherThing.typeId === 'Missile') {
                this.explode();
                (otherThing as Missile).explode;
            }
        }

        Body.prototype.handleCollision(report)
    }

    explode() {
        this.leaveWorld()
        new ExpandingRing({ x: this.data.x, y: this.data.y, size: 50, duration: 20 }).enterWorld(this.world)
    }
}

export {Bomb}