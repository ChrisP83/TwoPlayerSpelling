import { Power3, TweenMax } from "gsap";
import Phaser from "phaser";
import { GameScene } from "src/scene/GameScene";
import * as GG from '../GG';

export default class Toast {

    /**
     * Scene this plate belongs to.
     */
    scene: Phaser.Scene;

    spr: Phaser.GameObjects.Sprite;

    ////

    /**
     * The letter to be matched.
     */
    private _letter: string;

    private _isToast: boolean = false;

    private _frames: Phaser.Animations.AnimationFrame[];

    /**
     * Constructs a new toast sprite and makes enables interactivity by default.
     * @param scene [Phaser.Scene] the scene the spr belongs to (also created by).
     */
    constructor(scene: Phaser.Scene) {
        this.spr = scene.add.sprite(0, 0, GG.KEYS.ATLAS_SS1)
            .play(GG.KEYS.ANIMS.TOAST_LETTERS)
            .stop();
        this.scene = scene;

        // Interactive by default.
        this.setInterractive();

        this._frames = this.spr.anims.currentAnim.frames;
        this._isToast = false;
        this.letter = '';
    }

    setXY(x: number, y: number): Toast {
        if (this.spr) {
            this.spr.x = x;
            this.spr.y = y;
        }

        return this;
    }

    update(time: number, delta_time: number) {
        // this._smolPhys.update(time, delta_time);
    }

    setInterractive(is_interractive: boolean = true) {
        if (is_interractive == true) {
            this.spr.setInteractive({ draggable: true, useHandCursor: true });
            // this.spr.on("pointerdown", this._onPointerDown, this);
            // this.spr.on('drag', this._onDrag, this);
            this.spr.on('pointerup', this._onPointerUp, this);
        }
        else {
            this.spr.disableInteractive();
            // this.spr.off("pointerdown", this._onPointerDown, this);
            // this.spr.off('drag', this._onDrag);
            this.spr.off('pointerup', this._onPointerUp, this);
        }
    }

    reset() {
        this.active = false;
        this.visible = false;
        this._isToast = false;

        // this.setInterractive(false);
        // TweenMax.killTweensOf(this);

        this.spr.scale = 1;
    }

    //// Handlers.
    private _onPointerUp(pointer) {
        (this.scene as GameScene).checkToastToPlatesCase(this);

        this.setInterractive(false);
        TweenMax.to(this.spr, 0.25, {
            x: this.spr.x + pointer.velocity.x * 17.5,
            y: this.spr.y + pointer.velocity.y * 17.5,
            ease: Power3.easeOut,
            onComplete: () => {
                this.setInterractive(true);
                (this.scene as GameScene).checkToastToPlatesCase(this);
            }
        });

    }
    // TODO: ...
    // private _onPointerDown(pointer, localX, localY, event) {
    //     this.emit(CARD_EVENTS.POINTER_DOWN, pointer, localX, localY, event, this);
    //     GG.soundManager.playSound(GG.KEYS.SFX.CARD);
    // }

    // Keeping all the dragging in the Scene.input.
    // private _onDrag(pointer, drag_x: number, drag_y: number) {
    //     this.spr.x = drag_x;
    //     this.spr.y = drag_y;
    // }

    //// Setters and Getters.

    set active(is_active: boolean) {
        this.spr.active = is_active;
    }

    get isActive(): boolean {
        return this.spr.active;
    }

    set visible(is_visible: boolean) {
        this.spr.setVisible(is_visible);
    }

    get visible(): boolean {
        return this.spr.visible;
    }

    set letter(new_letter: string) {
        let index: number = TOAST_LETTER_FRAME_INDEXES[new_letter.toUpperCase()];

        if (index != 0 && !index) {
            index = 0;
            debugger
            console.warn("Cannot set Toast letter to: '%s', it is not a valid letter frame or choice!", new_letter);
            this._isToast = false;
            this._letter = "NONE";
            return;
        }

        this._letter = new_letter;
        this.spr.setFrame(this._frames[index].frame.name);
        console.log("Toast set to %s", this.spr.frame.name);
    }

    get letter(): string {
        return this._letter;
    }
}

export const TOAST_LETTER_FRAME_INDEXES = {
    "": 0, "NONE": 0, "A": 1, "B": 2, "C": 3, "D": 4, "E": 5, "F": 6, "G": 7, "H": 8, "I": 9, "J": 10, "K": 11, "L": 12, "M": 13, "N": 14, "O": 15, "P": 16, "Q": 17, "R": 18, "S": 19, "T": 20, "U": 21, "V": 22, "W": 23, "X": 24, "Y": 25, "Z": 26
}