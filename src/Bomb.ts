import { CollisionDetection, Body } from "../../worlds/src";
import { Explosion } from "./Explosion";
import { Missile } from "./Missle";



class Bomb extends Body {

    get typeId() { return "Bomb" }


    handleCollision(report: CollisionDetection.CollisionReport) {
        const otherThing = report.item1 === this ? report.item2 : report.item1
        if (otherThing.typeId !== 'Bomb') {
            this.explode();

            if (otherThing.typeId === 'Missile') {
                (otherThing as Missile).explode;
                this.reportPoints()
            }
        } else {
            Body.prototype.handleCollision(report)
        }
    }

    explode(explosionIsFromPlayer = false) {
        this.leaveWorld()
        new Explosion({
            x: this.data.x,
            y: this.data.y,
            size: 150,
            duration: 15,
            color: explosionIsFromPlayer ? "red" : "darkorange",
            isFromPlayer: explosionIsFromPlayer
        }).enterWorld(this.world)
    }

    reportPoints() {
        if (!this.world) { return }
        this.world.emitter.emit('points', 10)
    }

    move() {
        Body.prototype.move.apply(this, [])

        if (this.data.y > this.world.height + 200) {
            this.leaveWorld()
        }
    }
}

export { Bomb }