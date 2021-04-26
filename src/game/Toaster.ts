import Phaser from "phaser";
import GameScene from "src/scene/GameScene";
import * as GG from '../GG';
import ToasterLetterButton, { TLB_EVENTS } from './ToasterLetterButton';

export default class Toaster {
    /**
     * Scene this toaster belongs to.
     */
    scene: GameScene;

    spr: Phaser.GameObjects.Sprite;

    /**
     * Toaster button.
     */
    toastBtn: Phaser.GameObjects.Sprite;

    /**
     * Array containing the ToasterLetterButtons.
     */
    letterButtons: ToasterLetterButton[];

    ////

    private _word: string;
    private _wordBT: Phaser.GameObjects.BitmapText;

    private _cont: Phaser.GameObjects.Container;

    constructor(scene: GameScene) {
        this.scene = scene;
        this._cont = scene.add.container(0, 0);
        this.toastBtn = scene.add.sprite(385, -110, GG.KEYS.ATLAS_SS1, GG.KEYS.TOASTER_BTN);
        this.spr = scene.add.sprite(0, 0, GG.KEYS.ATLAS_SS1, GG.KEYS.TOASTER);

        this._cont.add([this.toastBtn, this.spr]);
        let letter_btn1 = new ToasterLetterButton(scene).setXY(-384, -174).addTo(this._cont);
        let letter_btn2 = new ToasterLetterButton(scene).setXY(-174, -174).addTo(this._cont);
        let letter_btn3 = new ToasterLetterButton(scene).setXY(26, -174).addTo(this._cont);
        let letter_btn4 = new ToasterLetterButton(scene).setXY(224, -174).addTo(this._cont);
        let letter_btn5 = new ToasterLetterButton(scene).setXY(424, -174).addTo(this._cont);

        this.letterButtons = [
            letter_btn1,
            letter_btn2,
            letter_btn3,
            letter_btn4,
            letter_btn5
        ];

        this.letterButtons.forEach((letter_btn: ToasterLetterButton) => {
            letter_btn.on(TLB_EVENTS.POINTER_DOWN, this._onLetterBtnPointerDown, this);
        });

        this._wordBT = scene.add.bitmapText(0, 72, GG.KEYS.FONTS.HOMER_LEARNING_BOLD, '');
        this._wordBT.originX = 0.5;
        this._wordBT.originY = 0.5;
        this._wordBT.tint = 0x6C737D;
        this._wordBT.scale = 1.0;

        this._cont.add(this._wordBT);
    }

    setXY(x: number, y: number): Toaster {
        if (this._cont) {
            this._cont.x = x;
            this._cont.y = y;
        }

        return this;
    }

    setLetters(letters: string[]) {
        let length = Math.min(letters.length, this.letterButtons.length);

        for (let i = 0; i < length; i++) {
            this.letterButtons[i].letter = letters[i];
        }
    }

    private _onLetterBtnPointerDown(pointer: Phaser.Input.Pointer, x: number, y: number, event, tlb: ToasterLetterButton) {

        let start_x = this._cont.x + this.spr.x + tlb.spr.x;
        let start_y = this._cont.y + this.spr.y - 200;
        let end_x = start_x + Phaser.Math.RND.between(-400, 400);
        let end_y = start_y + Phaser.Math.RND.between(-900, -500);
        let start_rotation = Phaser.Math.RND.between(-90, 90);
        let end_rotation = (180 + Phaser.Math.RND.between(-25, 25)) * Phaser.Math.DEG_TO_RAD;

        // Flip a coind 50/50 chance.
        if (Phaser.Math.RND.between(0, 1)) {
            start_rotation += Math.PI;
            end_rotation += Phaser.Math.PI2;
        }

        this.scene.launchToastLetter(start_x, start_y, end_x, end_y, start_rotation, end_rotation, tlb.letter);
    }

    /**
     * Returns the container of the toaster sprites.
     */
    get cont(): Phaser.GameObjects.Container {
        return this._cont;
    }

    set word(new_word: string) {
        this._word = new_word.toUpperCase();
        this._wordBT.text = this._word;
    }

    ////

}