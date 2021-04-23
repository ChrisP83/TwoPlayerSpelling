import Phaser from "phaser";
import * as GG from '../GG';

export class Toaster {
    /**
     * Scene this toaster belongs to.
     */
    scene: Phaser.Scene;

    spr: Phaser.GameObjects.Sprite;
    back_spr: Phaser.GameObjects.Sprite;

    /**
     * Toaster button.
     */
    btn: Phaser.GameObjects.Sprite;

    letter: string;
    letterBTF: Phaser.GameObjects.BitmapText;

    ////

    private _cont: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene) {
        this._cont = scene.add.container(0, 0);
        this.back_spr = scene.add.sprite(0, -40, GG.KEYS.ATLAS_SS1, GG.KEYS.TOASTER_BACK);
        this.btn = scene.add.sprite(385, -110, GG.KEYS.ATLAS_SS1, GG.KEYS.TOASTER_BTN);
        this.spr = scene.add.sprite(0, 0, GG.KEYS.ATLAS_SS1, GG.KEYS.TOASTER);

        this._cont.add([this.back_spr, this.btn, this.spr]);
    }

    setXY(x: number, y: number): Toaster {
        if (this._cont) {
            this._cont.x = x;
            this._cont.y = y;
        }

        return this;
    }

    /**
     * Returns the container of the toaster sprites.
     */
    get cont(): Phaser.GameObjects.Container {
        return this._cont;
    }
}