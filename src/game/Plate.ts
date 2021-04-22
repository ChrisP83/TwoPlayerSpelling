import Phaser from "phaser";
import * as GG from '../GG';

export class Plate {

    /**
     * The letter to be matched with.
     */
    hiddenLetter: string;

    /**
     * The letter index in the word.
     */
    hiddenLetterIx: number;

    /**
     * Scene this plate belongs to.
     */
    scene: Phaser.Scene;

    spr: Phaser.GameObjects.Sprite;

    /**
     * Creates a new Plate sprite encapsulated in this object.
     * @param scene [Phaser.Scene] the scene the spr belongs to (also created by).
     * @param letter_index [number] the index in the word this letter belongs to.
     */
    constructor(scene: Phaser.Scene, letter_index: number) {
        this.hiddenLetterIx = letter_index;
        this.spr = scene.add.sprite(0, 0, GG.KEYS.ATLAS_SS1, GG.KEYS.PLATE);
    }

    isCorrectLetter(letter: string) {
        return letter == this.hiddenLetter;
    }

    setXY(x: number, y: number) {
        if (this.spr) {
            this.spr.x = x;
            this.spr.y = y;
        }
    }
}