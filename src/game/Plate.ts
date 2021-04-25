import Phaser from "phaser";
import * as GG from '../GG';
import { Toast } from "./Toast";

export class Plate {

    /**
     * Scene this plate belongs to.
     */
    scene: Phaser.Scene;

    /**
     * The plate sprite encapsulated.
     */
    spr: Phaser.GameObjects.Sprite;

    /**
     * The toast that is assigned or placed on this plate.
     */
    toast: Toast;

    /**
     * Creates a new Plate sprite encapsulated in this object.
     * @param scene [Phaser.Scene] the scene the spr belongs to (also created by).
     */
    constructor(scene: Phaser.Scene) {
        this.spr = scene.add.sprite(0, 0, GG.KEYS.ATLAS_SS1, GG.KEYS.PLATE).setInteractive();
        this.spr.input.dropZone = true;
    }

    setXY(x: number, y: number): Plate {
        if (this.spr) {
            this.spr.x = x;
            this.spr.y = y;
        }

        return this;
    }

    canDropToast(): boolean {
        return !this.toast;
    }

    dropToast(new_toast: Toast) {
        this.toast = new_toast;

        // TODO: Animate the toast landing on the plate.
    }
}