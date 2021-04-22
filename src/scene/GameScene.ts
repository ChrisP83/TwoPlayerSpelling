import Phaser from "phaser";
import * as GG from "../GG";
// import { Card, CARD_EVENTS } from "../game/Card";
import { LifeBar } from "../ui/LifeBar";
import { ActorsManager } from "../game/ActorsManager";
import { Power2, TweenMax } from "gsap";
import { ScaledButton } from "src/ui/ScaledButton";

export class GameScene extends Phaser.Scene {
    bg: Phaser.GameObjects.Image;

    /**
     * Game actors pooling.
     */
    actorsMng: ActorsManager;

    gridSize: Phaser.Geom.Point;
    gridCont: Phaser.GameObjects.Container;
    gridPadding: Phaser.Geom.Point;

    /**
     * All the cards.
     */
    // TODO: toasts: Card[];
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
        let card_face_frames = this.anims.generateFrameNames(GG.KEYS.ATLAS_SS1, { prefix: 'card', end: 10, zeroPad: 4 });
        this.anims.create({ key: GG.KEYS.ANIMS.CARD_FACES, frames: card_face_frames, repeat: -1, frameRate: 30 });

        // Actors pooling.
        this.actorsMng = new ActorsManager(this);

        // Grid setup.
        this.gridSize = new Phaser.Geom.Point(3, 4);
        this.gridCont = this.add.container();

        this.gridPadding = new Phaser.Geom.Point(10, 10);
        
        this.fit();
        this.enableResizeListener();

        this.startGame();

        // Play the game instructions.
        if (!GG.SHARED.gameInstrPlayed) {
            // TODO: GG.soundManager.playSound(GG.KEYS.SFX.GAME_INSTR);
            GG.SHARED.gameInstrPlayed = true
        }

        // DEV.
        // this.testCardCreation(); // OK.
        // this.testCardPooling(); // OK.
        // this._doGameWon(); // OK.
    }

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

        this.gridCont.removeAll();
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

    // testCardCreation() {
    //     let card1 = new Card(GG.CARD_TYPE.PIG, this, 0).setXY(200, 150);
    //     card1.type = GG.CARD_TYPE.SPIDER;
    //     let card2 = new Card(GG.CARD_TYPE.SPIDER, this, 1).setXY(500, 150);
    //     card2.type = GG.CARD_TYPE.DRAGON
    //     // let card3 = new Card(11, this).setXY(700, 150); // OK.
    //     // let card4 = new Card(-1, this).setXY(700, 150); // OK.
    // }

}