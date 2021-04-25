import Phaser from "phaser";
import * as GG from '../GG';
import ToasterLetterButton from './ToasterLetterButton';

export default class Toaster {
    /**
     * Scene this toaster belongs to.
     */
    scene: Phaser.Scene;

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

    constructor(scene: Phaser.Scene) {
        this._cont = scene.add.container(0, 0);
        this.toastBtn = scene.add.sprite(385, -110, GG.KEYS.ATLAS_SS1, GG.KEYS.TOASTER_BTN);
        this.spr = scene.add.sprite(0, 0, GG.KEYS.ATLAS_SS1, GG.KEYS.TOASTER);


        this._cont.add([this.toastBtn, this.spr]);
        let letter_btn1 = new ToasterLetterButton(scene).setXY(-384, -44).addTo(this._cont);
        let letter_btn2 = new ToasterLetterButton(scene).setXY(-184, -44).addTo(this._cont);
        let letter_btn3 = new ToasterLetterButton(scene).setXY(16, -44).addTo(this._cont);
        let letter_btn4 = new ToasterLetterButton(scene).setXY(214, -44).addTo(this._cont);
        let letter_btn5 = new ToasterLetterButton(scene).setXY(414, -44).addTo(this._cont);

        this.letterButtons = [
            letter_btn1,
            letter_btn2,
            letter_btn3,
            letter_btn4,
            letter_btn5
        ];
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

    set word(new_word: string) {
        this._word = new_word.toLowerCase();
        this._wordBT.text = this._word;
    }


    ////

}