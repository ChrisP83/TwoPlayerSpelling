import Phaser from "phaser";
import * as GG from "../GG";
import { Toast, TOAST_LETTER_FRAME_INDEXES } from "../game/Toast";
// import { LifeBar } from "../ui/LifeBar";
// import { ScaledButton } from "src/ui/ScaledButton";
import { ActorsManager } from "../game/ActorsManager";
import { Power2, TweenMax } from "gsap";

export class GameScene extends Phaser.Scene {
    bg: Phaser.GameObjects.Image;

    /**
     * Game actors pooling.
     */
    actorsMng: ActorsManager;

    /**
     * All the toasts.
     */
    // TODO: toasts: Toast[];
    numMatches: number = 0;

    // todo: private _gameWonParticles: Phaser.GameObjects.Particles.ParticleEmitter;
    private _isGameOver: boolean = false;

    ////

    constructor() {
        super({
            key: GG.KEYS.SCENE.GAME
        });
    }

    create(data: Object) {
        this.bg = this.add.image(0, 0, GG.KEYS.BACKGROUND).setOrigin(0, 0);

        // Card faces as an animation.
        let toast_frames = this.anims.generateFrameNames(GG.KEYS.ATLAS_SS1, { prefix: 'toast', end: 26, zeroPad: 4 });
        this.anims.create({ key: GG.KEYS.ANIMS.TOAST_LETTERS, frames: toast_frames, repeat: -1, frameRate: 30 });

        // Actors pooling.
        this.actorsMng = new ActorsManager(this);

        this._setupPlates();
        this._setupToaster();

        this.fit();
        this.enableResizeListener();

        this.startGame();

        // Play the game instructions.
        if (!GG.SHARED.gameInstrPlayed) {
            // TODO: GG.soundManager.playSound(GG.KEYS.SFX.GAME_INSTR);
            GG.SHARED.gameInstrPlayed = true
        }

        // DEV.
        this.testToastCreation(); // OK.
        // this.testToastPooling(); // OK.
        // this._doGameWon(); // OK.
    }

    //// setup.

    /**
     * Set up the plates and listeners.
     */
    private _setupPlates() {

    }

    /**
     * Set up the toaster.
     */
    private _setupToaster() {

    }

    ////

    startGame() {
        this._isGameOver = false;
        this.numMatches = 0;
    }

    update(time: number, delta_time: number) {
        if (this._isGameOver == true) { return; }
    }

    /**
     * Creates a particle based animation of cards falling on the screen like snowflakes.
     */
    private _doGameWon() {
        // Pause the lifebar updates.
        this._isGameOver = true;

        let screen_w: number = this.game.renderer.width;
        let screen_h: number = this.game.renderer.height;

        // TODO: GG.soundManager.playSound(GG.KEYS.SFX.GAME_WON);
    }

    private _doGameLost() {
        // Pause the lifebar updates.
        this._isGameOver = true;

        // TODO: Disable input on all interractive elements.


        // Freeze everything in place.
        TweenMax.killAll();
        TweenMax.delayedCall(5, this._goBackToTheLobbyScene, null, this);

        // TODO: GG.soundManager.playSound(GG.KEYS.SFX.GAME_LOST);
    }

    /**
     * 
     */
    private _goBackToTheLobbyScene() {
        TweenMax.killAll();
        this.reset();
        this.scene.start(GG.KEYS.SCENE.LOBBY, { fromScene: GG.KEYS.SCENE.GAME });
    }

    /**
     * Fits the background and gamplay elements to fit the available screen size.
     */
    fit() {
        let screen_w: number = this.game.renderer.width;
        let screen_h: number = this.game.renderer.height;

        // Fit in the background covering the entire available screen and center on the larger side.
        this.bg.setScale(1);
        let bg_scale: number = Math.max(screen_w / this.bg.width, screen_h / this.bg.displayHeight);
        this.bg.setScale(bg_scale);
        this.bg.x = Math.floor((screen_w - this.bg.displayWidth) * 0.5);
        this.bg.y = Math.floor((screen_h - this.bg.displayHeight) * 0.5);

        // Fit the grid of cards.
        if (screen_w > screen_h) {
            this.fitLandscape();
        }
        else {
            this.fitPortrait();
        }
    }

    fitLandscape() {
        let screen_w: number = this.game.renderer.width;
        let screen_h: number = this.game.renderer.height;

        // TODO: 
    }

    fitPortrait() {
        let screen_w: number = this.game.renderer.width;
        let screen_h: number = this.game.renderer.height;

    }

    reset() {
        // TODO: reset toast actors.
        // while (this.cards.length > 0) {
        //     const card: Card = this.cards.pop();
        //     card.off(CARD_EVENTS.POINTER_DOWN, this._onCardPointerDown, this);
        //     this.actorsMng.poolCard(card);
        // }

        // this.gridCont.removeAll();
        TweenMax.killAll();

        this.numMatches = 0;
    }


    /**
     * Enables the resize listener for this scene.
     * Should be called when activating this scene.
     */
    enableResizeListener() {
        GG.setCurrentScene(this);
        this.scale.on('resize', this.fit, this);
    }

    /**
     * Disables the resize listener for this scene.
     * Ussually called when switching to a new scene.
     */
    disableResizeListener() {
        GG.setCurrentScene(null);
        this.scale.off('resize', this.fit, this);
    }

    ////

    // testCardPooling() {
    //     let c1 = this.actorsMng.getCard(GG.CARD_TYPE.COW).setXY(200, 280);
    //     let c2 = this.actorsMng.getCard(GG.CARD_TYPE.DRAGON).setXY(500, 280);
    // }

    testToastCreation() {
        let toast1 = new Toast(this).setXY(200, 200);
        toast1.letter = "A";

        let toast2 = new Toast(this).setXY(700, 700);
        toast2.letter = "B";

        let toast3 = new Toast(this).setXY(1000, 1000);
        toast3.letter = "C";
    }

}