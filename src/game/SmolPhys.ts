import Phaser from "phaser";
import * as GG from '../GG';

/**
 * Planned as a very small, only what we need sort of physics for this game.
 */
export default class SmolPhys {
    private _target: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image | Phaser.GameObjects.Container;

    vel: Phaser.Math.Vector2;
    damping: number;

    constructor(target: Phaser.GameObjects.Sprite | Phaser.GameObjects.Image | Phaser.GameObjects.Container) {
        this._target = target;
        this.vel = new Phaser.Math.Vector2();
        this.damping = 0.2;
    }

    setVelXY(x: number, y: number): SmolPhys {
        this.vel.x = x;
        this.vel.y = y;

        return this;
    }

    setDamping(new_daming: number): SmolPhys {
        this.damping = this.damping;

        return this;
    }

    update(time: number, delta_time: number) {
        this._target.x += this.vel.x * delta_time;
        this._target.y += this.vel.y * delta_time;

        if (this.vel.x > this.damping) {
            this.vel.x -= this.damping * delta_time;
        }
        else {
            this.vel.y = 0;
        }

        if (this.vel.y > this.damping) {
            this.vel.y -= this.damping * delta_time;
        }
        else {
            this.vel.y = 0;
        }
    }
}