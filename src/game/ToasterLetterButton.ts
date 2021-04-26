import Phaser from "phaser";
import * as GG from '../GG';

export default class ToasterLetterButton extends Phaser.Events.EventEmitter {

    letterBT: Phaser.GameObjects.BitmapText;
    spr: Phaser.GameObjects.Sprite;

    ////

    private _letter: string;

    // private _cont: Phaser.GameObjects.Container;

    constructor(scene: Phaser.Scene) {
        super();
        // this._cont = scene.add.container();

        this.spr = scene.add.sprite(0, 0, GG.KEYS.ATLAS_SS1, GG.KEYS.TOASTER_LETTER_BTN);
        this.letterBT = scene.add.bitmapText(0, 0, GG.KEYS.FONTS.HOMER_LEARNING_BOLD, '');
        this.letterBT.originX = 0.45;
        this.letterBT.originY = 0.4;
        this.letterBT.tint = 0x050522;
        this.letterBT.scale = 0.85;

        this.setInterractive();
    }

    get letter(): string {
        return this._letter;
    }

    set letter(new_letter: string) {
        this._letter = new_letter.toLocaleLowerCase();

        switch (this._letter) {
            case 'w':
                this.letterBT.originX = 0.475;
                this.letterBT.scale = 0.82;
                break;

            default:
                this.letterBT.originY = 0.5;
                this.letterBT.originY = 0.4;
                this.letterBT.scale = 0.85;
                break;
        }

        this.letterBT.text = this._letter.toUpperCase();
    }

    setXY(x: number, y: number): ToasterLetterButton {
        this.spr.x = x;
        this.spr.y = y;
        this.letterBT.x = x;
        this.letterBT.y = y;

        return this;
    }

    addTo(cont: Phaser.GameObjects.Container): ToasterLetterButton {
        if (cont) {
            cont.add([this.spr, this.letterBT]);
        }

        return this;
    }

    setInterractive(is_interractive: boolean = true) {
        if (is_interractive == true) {
            this.spr.setInteractive({ useHandCursor: true });
            this.spr.on("pointerdown", this._onPointerDown, this);
            // this.spr.on('drag', this._onDrag, this);
        }
        else {
            this.spr.disableInteractive();
            this.spr.off("pointerdown", this._onPointerDown, this);
            // this.spr.off('drag', this._onDrag);
        }
    }

    ////

    private _onPointerDown(pointer, localX, localY, event) {
        this.emit(TLB_EVENTS.POINTER_DOWN, pointer, localX, localY, event, this);
        // TODO: GG.soundManager.playSound(GG.KEYS.SFX.BUTTON_PRESS);
    }

    private _onPointerUp(pointer, localX, localY, event) {
        console.log("ToasterLetterButton _onPointerUp...", this._letter);
        this.emit(TLB_EVENTS.POINTER_UP, pointer, localX, localY, event, this);
    }
}

/**
 * Toaster letter button events.
 */
export const TLB_EVENTS = {
    POINTER_DOWN: 'tlb_pointer_down',
    POINTER_UP: 'tlb_pointer_up'
}