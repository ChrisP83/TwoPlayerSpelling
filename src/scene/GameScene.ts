import Phaser from "phaser";
import * as GG from "../GG";
import Toast from "../game/Toast";
import Toaster from "../game/Toaster";
import Plate from "../game/Plate";
import ActorsManager from "../game/ActorsManager";
import { Elastic, Power2, Power3, TweenMax } from "gsap";
import { iGameData } from "../game/iGameData";

export default class GameScene extends Phaser.Scene {
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
    private _checkMark: Phaser.GameObjects.Image;
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

        // Setup the checkmark.
        this._setupCheckMark();

        this._cont.add(this._checkMark);
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
        // this.testToastCreation(); // OK.
        // this.testDraggable(); // OK.
        // this.testHomerFont(); // OK.
        // this.testToasterLettersButtons();// OK.
        // this.testCheckMark();// OK.
        // this.testToastPooling(); // TODO.
        // this._doGameWon(); // TODO.
    }

    //// helpers.

    /**
     * Set up the plates and listeners.
     */
    private _setupPlates() {
        let plate1 = new Plate(this).setXY(278, 300);
        let plate2 = new Plate(this).setXY(770, 300);
        let plate3 = new Plate(this).setXY(1262, 300);

        this._plates = [plate3, plate2, plate1];
        this._cont.add([plate1.spr, plate2.spr, plate3.spr]);
    }

    /**
     * Sets up the toaster.
     */
    private _setupToaster() {
        this.toaster = new Toaster(this).setXY(787, 1920);
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

    private _setupCheckMark() {
        this._checkMark = this.add.image(0, 0, GG.KEYS.CHECK);
        this._checkMark.x = GG.GAME_DIMS.halfWidth;
        this._checkMark.y = GG.GAME_DIMS.halfHeight;
        this._checkMark.angle = -180;
        this._checkMark.visible = false;
    }

    //// start, update.

    startGame() {
        this._isGameOver = false;
        this.setNewWord();
    }

    update(time: number, delta_time: number) {
        if (this._isGameOver == true) { return; }
        let toasts_len: number = this.toasts.length;
        for (let i = 0; i < toasts_len; i++) {
            const toast: Toast = this.toasts[i];
            toast.update(time, delta_time);
        }
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

    //// game won / lost.

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

    private _showCheckMark() {
        this._checkMark.visible = true;
        this._checkMark.scale = 0.01;
        this._checkMark.alpha = 0.01;
        this._checkMark.angle = 0;
        this._cont.bringToTop(this._checkMark);

        TweenMax.to(this._checkMark, 1, {
            scaleX: 0.7,
            scaleY: 0.7,
            alpha: 1,
            ease: Elastic.easeOut.config(1, 0.75),
            onComplete: () => {
                TweenMax.to(this._checkMark, 1, {
                    angle: 180,
                    ease: Elastic.easeInOut.config(1.5, 0.5),
                    onComplete: this._setEnabledCheckMarkInput,
                    onCompleteScope: this
                });
            },
            onCompleteScope: this
        });
    }

    private _hideCheckMark() {
        this._checkMark.visible = true;
        this._checkMark.scale = 0.7;
        this._checkMark.alpha = 1;
        this._checkMark.angle = 180;
        this._cont.bringToTop(this._checkMark);

        this._setEnabledCheckMarkInput(false);

        TweenMax.to(this._checkMark, 1, {
            scaleX: 0.01,
            scaleY: 0.01,
            alpha: 0.01,
            ease: Power3.easeIn,
            onComplete: () => {
                this._checkMark.visible = false;
            },
            onCompleteScope: this
        });
    }

    private _setEnabledCheckMarkInput(is_enabled: boolean = true) {
        if (is_enabled) {
            this._checkMark.setInteractive({ useHandCursor: true });
            this._checkMark.on("pointerdown", this._onCheckMarkTap, this);
        }
        else {
            this._checkMark.disableInteractive();
            this._checkMark.off("pointerdown", this._onCheckMarkTap, this);
        }
    }

    private _onCheckMarkTap() {
        this._hideCheckMark();
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

    //// scene traversal.
    /**
     * 
     */
    private _goBackToTheLobbyScene() {
        TweenMax.killAll();
        this.reset();
        this.scene.start(GG.KEYS.SCENE.LOBBY, { fromScene: GG.KEYS.SCENE.GAME });
    }

    //// drag, resize.




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
            (game_obj.toast as Toast).letter = undefined;
        }, this);

        this.input.on('drag', (pointer, game_obj, drag_x, drag_y) => {
            game_obj.x = drag_x;
            game_obj.y = drag_y;
        });
    }

    //// game logic.

    /**
     * Sets a new word and updates the toaster letters and winning condition checks for the newly picked word.
     */
    setNewWord() {
        // Pick a new word.
        this.word = this._pickWord();
        this.toaster.word = this.word;

        // Letters.
        let low_case_alphabet = [
            "a", "b", "c", "d", "e", "f", "g",
            "h", "i", "j", "k", "l", "m", "n",
            "o", "p", "q", "r", "s", "t", "u",
            "v", "w", "x", "y", "z"];

        // Remove the ones that are already in the word.
        let word_letters = this.word.split("");
        let toaster_letters: string[] = [];
        word_letters.forEach((letter: string) => {
            let ix = low_case_alphabet.indexOf(letter);
            // Letters already removed or not in the low case (allowed) alphabet are ignored.
            if (ix > -1) {
                toaster_letters.push(letter);
                low_case_alphabet.splice(ix, 1);
            }
        });

        // Fill the rest of the letters from the low_case_alphabet.
        Phaser.Utils.Array.Shuffle(low_case_alphabet) // Shuffle the rest of the lower case letters.
        for (let i = toaster_letters.length; i < GG.NUM_TOASTER_LETTERS; i++) {
            toaster_letters.push(low_case_alphabet.pop());
        }

        // Shuffle the result, otherwise the kids' side might get a clue of where the correct letters "always are" are!
        Phaser.Utils.Array.Shuffle(toaster_letters);

        // Update the toaster and game on!
        this.toaster.setLetters(toaster_letters);
    }

    /**
     * 
     * @param toast 
     */
    checkToastToPlatesCase(toast: Toast) {
        // First, try all the plates and keep track of intersections.
        let intersect_plates: Plate[] = [];
        let plates_len: number = this._plates.length;
        for (let i = 0; i < plates_len; i++) {
            const plate: Plate = this._plates[i];
            let rect = Phaser.Geom.Rectangle.Intersection(plate.spr.getBounds(), toast.spr.getBounds());
            if (rect.width > 75 && rect.height > 80) {
                intersect_plates.push(plate);
            }
        }

        // If we have any plate intersection keep the shortest distance to the toast.
        if (intersect_plates.length > 0) {

            // Assume the first entry is the right one.
            let result_plate: Plate = undefined;// Closest plate to the toast / toast.
            let shortest_dist_to_plate: number = 81000001; // OVER 9000 squared!

            // Check for distance to the other entries.
            let intersect_plates_len = intersect_plates.length;
            for (let i = 0; i < intersect_plates_len; i++) {
                const plate: Plate = intersect_plates[i];
                // Use the squared distance, no need to use sqrt.
                let dist = Phaser.Math.Distance.Squared(plate.spr.x, plate.spr.y, toast.spr.x, toast.spr.y);

                if (dist < shortest_dist_to_plate) {
                    shortest_dist_to_plate = dist;
                    result_plate = plate;
                }
            }

            // Move the toast to the result plate.
            TweenMax.to(toast.spr, 0.25, { x: result_plate.spr.x, y: result_plate.spr.y });
            result_plate.letter = toast.letter;
            this._checkWinCondition();
            return;
        }
    }

    private _checkWinCondition() {
        for (let i = this._plates.length - 1; i >= 0; i--) {
            const plate = this._plates[i];
            if (this.word.charAt(i) != plate.letter) {
                return false;
            }
        }

        this._showCheckMark();
        return true;
    }

    launchToastLetter(
        start_x: number, start_y: number, end_x: number, end_y: number,
        start_rotation: number, end_rotation: number, letter: string) {

        let toast = new Toast(this).setXY(start_x, start_y);
        toast.letter = letter;
        toast.spr.rotation = start_rotation;

        this.toasts.push(toast);
        this._cont.add(toast.spr);
        this._cont.bringToTop(this.toaster.cont);

        toast.setInterractive(false);
        TweenMax.to(toast.spr, 1, {
            x: end_x,
            y: end_y,
            rotation: end_rotation,
            ease: Power3.easeOut,
            onComplete: () => {
                toast.setInterractive(true);
            },
            onCompleteScope: this
        });
    }

    /**
     * Picks a word from the array of words. If the array of words is empty it resets it to full and shuffled.
     * @returns a word from the list of words.
     */
    private _pickWord(): string {
        if (this.words.length > 0)
            return this.words.pop();

        this._setupWords();
        return this.words.pop();
    }

    //// reset and cleanups.

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

    ////

    // testCardPooling() {
    //     let c1 = this.actorsMng.getCard(GG.CARD_TYPE.COW).setXY(200, 280);
    //     let c2 = this.actorsMng.getCard(GG.CARD_TYPE.DRAGON).setXY(500, 280);
    // }

    testToastCreation() {
        this.word = this._pickWord();
        this.toaster.word = this.word;

        let toast1 = new Toast(this).setXY(500, 800);
        toast1.letter = this.word.charAt(0);

        let toast2 = new Toast(this).setXY(750, 900);
        toast2.letter = this.word.charAt(1);

        let toast3 = new Toast(this).setXY(1000, 1000);
        toast3.letter = this.word.charAt(2);

        this.toasts.push(toast1, toast2, toast3);
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

    testHomerFont() {
        let bt1 = this.add.bitmapText(300, 300, GG.KEYS.FONTS.HOMER_LEARNING_BOLD, "abcd efg HIJK");
        bt1.tint = 0x000000;

        let bt2 = this.add.bitmapText(200, 500, GG.KEYS.FONTS.HOMER_LEARNING_BOLD, "hijklmnop");
        bt2.tint = 0x6C737D;

        let bt3 = this.add.bitmapText(200, 700, GG.KEYS.FONTS.HOMER_LEARNING_BOLD, "qrs tuv wxyz");
        bt3.tint = 0xF4754E;

    }

    testCheckMark() {
        this._showCheckMark();
    }

    testToasterLettersButtons() {
        // this.toaster.letterButtons[0].letter = 'b';
        // this.toaster.letterButtons[1].letter = 'd';
        // this.toaster.letterButtons[2].letter = 'q';
        // this.toaster.letterButtons[3].letter = 'j';
        // this.toaster.letterButtons[4].letter = 'y';

        // this.toaster.letterButtons[0].letter = 'a';
        // this.toaster.letterButtons[1].letter = 'b';
        // this.toaster.letterButtons[2].letter = 'c';
        // this.toaster.letterButtons[3].letter = 'd';
        // this.toaster.letterButtons[4].letter = 'e';

        // this.toaster.letterButtons[0].letter = 'h';
        // this.toaster.letterButtons[1].letter = 'i';
        // this.toaster.letterButtons[2].letter = 'j';
        // this.toaster.letterButtons[3].letter = 'k';
        // this.toaster.letterButtons[4].letter = 'l';

        // this.toaster.letterButtons[0].letter = 'm';
        // this.toaster.letterButtons[1].letter = 'n';
        // this.toaster.letterButtons[2].letter = 'o';
        // this.toaster.letterButtons[3].letter = 'p';
        // this.toaster.letterButtons[4].letter = 'q';

        // this.toaster.letterButtons[0].letter = 'r';
        // this.toaster.letterButtons[1].letter = 's';
        // this.toaster.letterButtons[2].letter = 't';
        // this.toaster.letterButtons[3].letter = 'u';
        // this.toaster.letterButtons[4].letter = 'v';

        // this.toaster.letterButtons[0].letter = 'w';
        // this.toaster.letterButtons[1].letter = 'x';
        // this.toaster.letterButtons[2].letter = 'y';
        // this.toaster.letterButtons[3].letter = 'z';

    }

}