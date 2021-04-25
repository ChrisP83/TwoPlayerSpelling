import Phaser from "phaser";
import * as GG from "../GG";
import { Toast } from "../game/Toast";
import { Toaster } from "../game/Toaster";
import { Plate } from "../game/Plate";
import { ActorsManager } from "../game/ActorsManager";
import { Power2, TweenMax } from "gsap";
import { iGameData } from "../game/iGameData";


export class GameScene extends Phaser.Scene {
    bg: Phaser.GameObjects.Image;

    /**
     * Game actors pooling.
     */
    actorsMng: ActorsManager;

    /**
     * All the toasts.
     */
    toasts: Toast[];
    toaster: Toaster;
    // loafDispenser: Phaser.GameObjects.Sprite;

    /**
     * Object from json config.
     */
    gameData: iGameData;

    /**
     * Array of all words that can be chosen.
     */
    words: string[];

    /**
     * Currently chosen word.
     */
    word: string;

    ////

    // todo: private _gameWonParticles: Phaser.GameObjects.Particles.ParticleEmitter;
    private _isGameOver: boolean = false;
    private _plates: Plate[];
    private _cont: Phaser.GameObjects.Container;

    constructor() {
        super({
            key: GG.KEYS.SCENE.GAME
        });
    }

    create(data: Object) {
        this._cont = this.add.container();
        this.bg = this.add.image(0, 0, GG.KEYS.BACKGROUND).setOrigin(0, 0);

        // Card faces as an animation.
        let toast_frames = this.anims.generateFrameNames(GG.KEYS.ATLAS_SS1, { prefix: 'toast', end: 26, zeroPad: 4 });
        this.anims.create({ key: GG.KEYS.ANIMS.TOAST_LETTERS, frames: toast_frames, repeat: -1, frameRate: 30 });

        // Max 3 simultaneous pointers.
        this.input.addPointer(2);

        // Init the game data from the json.
        this.gameData = this.cache.json.get(GG.KEYS.JSON_DATA);

        // Actors pooling.
        this.actorsMng = new ActorsManager(this);
        // Shuffled words to chose from.
        this._setupWords();
        this._setupPlates();
        this._setupToaster();
        // this._setupLoafDispenser();
        this.toasts = [];

        this.fit();
        this.enableResizeListener();
        this.enableDragging();
        this.startGame();

        // TODO: Play the game instructions.
        // if (!GG.SHARED.gameInstrPlayed) {
        //     GG.soundManager.playSound(GG.KEYS.SFX.GAME_INSTR);
        //     GG.SHARED.gameInstrPlayed = true
        // }

        // DEV.
        this.testToastCreation(); // OK.
        // this.testDraggable();
        // this.testToastPooling(); // OK.
        // this._doGameWon(); // OK.
    }

    //// helpers.

    /**
     * Set up the plates and listeners.
     */
    private _setupPlates() {
        let plate1 = new Plate(this).setXY(278, 284);
        let plate2 = new Plate(this).setXY(770, 284);
        let plate3 = new Plate(this).setXY(1262, 284);

        this._plates = [plate1, plate2, plate3];
        this._cont.add([plate1.spr, plate2.spr, plate3.spr]);
    }

    /**
     * Sets up the toaster.
     */
    private _setupToaster() {
        this.toaster = new Toaster(this).setXY(1058, 1716); 3
        this._cont.add(this.toaster.cont);
    }

    /**
     * Sets up the loaf dispenser button.
     */
    // private _setupLoafDispenser() {
    //     this.loafDispenser = this.add.sprite(280, 1770, GG.KEYS.ATLAS_SS1, GG.KEYS.LOAF_DISPENSER);
    //     this._cont.add(this.loafDispenser);
    // }

    /**
     * Initializes the list of words from the game data words settings and shuffles them.
     */
    private _setupWords() {
        this.words = [];
        if (this.gameData && this.gameData.words) {
            this.words = Object.keys(this.gameData.words);
        }
        Phaser.Utils.Array.Shuffle(this.words);
    }

    /**
     * Draws a word from the array of words. If the array of words is empty it resets it to full and shuffled.
     * @returns a word from the list of words.
     */
    private _drawWord(): string {
        if (this.words.length > 0)
            return this.words.pop();

        this._setupWords();
        return this.words.pop();
    }

    //// start, update.

    startGame() {
        this._isGameOver = false;
    }

    update(time: number, delta_time: number) {
        if (this._isGameOver == true) { return; }
    }

    //// Fitting.

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

        this.fitPortrait();

        // Bring the game elements container to the top of the draw list.
        this.children.bringToTop(this._cont);

        // Fit the game elements.
        // if (screen_w > screen_h) {
        //     this.fitLandscape();
        // }
        // else {
        //     this.fitPortrait();
        // }
    }

    fitLandscape() {
        let screen_w: number = this.game.renderer.width;
        let screen_h: number = this.game.renderer.height;

        // TODO: 
    }

    fitPortrait() {
        let screen_w: number = this.game.renderer.width;
        let screen_h: number = this.game.renderer.height;

        let scale_x = screen_w / GG.GAME_DIMS.width;
        let scale_y = screen_h / GG.GAME_DIMS.height;
        let scale = Math.min(scale_x, scale_y);

        this._cont.scale = scale;
        let cont_w: number = GG.GAME_DIMS.width * scale;
        let cont_h: number = GG.GAME_DIMS.height * scale;

        this._cont.x = (screen_w - cont_w) * 0.5;
        this._cont.y = (screen_h - cont_h) * 0.5;
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

    //// game won / lost, scene traversal.
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

    //// reset, drag, resize.

    reset() {
        // Reset toast actors.
        while (this.toasts.length > 0) {
            const toast: Toast = this.toasts.pop();
            // TODO: ...
            // toast.spr.off("pointerdown", this._onToastPointerDown, this);
            // this.actorsMng.poolToast(toast);
        }

        TweenMax.killAll();
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

    enableDragging() {

        this.input.on('dragstart', (pointer, game_obj) => {
            this._cont.bringToTop(game_obj);
        }, this);

        this.input.on('drag', (pointer, game_obj, drag_x, drag_y) => {
            game_obj.x = drag_x;
            game_obj.y = drag_y;
        });

        this.input.on('drop', (pointer, game_obj, drop_zone) => {
            // game_obj.x = drop_zone.x;
            // game_obj.y = drop_zone.y;

            TweenMax.to(game_obj, 0.25, { x: drop_zone.x, y: drop_zone.y });
        }, this);
    }

    ////

    // testCardPooling() {
    //     let c1 = this.actorsMng.getCard(GG.CARD_TYPE.COW).setXY(200, 280);
    //     let c2 = this.actorsMng.getCard(GG.CARD_TYPE.DRAGON).setXY(500, 280);
    // }

    testToastCreation() {
        this.word = this._drawWord();
        let toast1 = new Toast(this).setXY(500, 800);
        toast1.letter = this.word.charAt(0);

        let toast2 = new Toast(this).setXY(750, 900);
        toast2.letter = this.word.charAt(1);

        let toast3 = new Toast(this).setXY(1000, 1000);
        toast3.letter = this.word.charAt(2);

        this._cont.add([toast1.spr, toast2.spr, toast3.spr])
    }

    testDraggable() {
        let spr = this.add.sprite(900, 400, GG.KEYS.ATLAS_SS1, GG.KEYS.LOAF).setInteractive({ draggable: true });
        spr.on('drag', (pointer, drag_x, drag_y) => {
            spr.x = drag_x;
            spr.y = drag_y;
        }, this);
        this._cont.add(spr);
    }

}