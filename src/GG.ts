// import SoundManager from './game/SoundManager';
// import MusicManager from './game/MusicManager';

/**
 * A global game space for the game's settings and easy shareables.
 */

export const GAME_DIMS = {
    width: 1536,
    halfWidth: 768,
    height: 2048,
    halfHeight: 1024
}

/**
 * Number of letters in a word.
 */
export const NUM_WORD_LETTERS = 3;

/**
 * The number of buttons and toaster letters.
 */
export const NUM_TOASTER_LETTERS = 5;

export const ACTOR_ID = {
    TOAST: 0,
    POOF_GFX: 1
}

/**
 * Actors z-like depths.
 */
export const BASE_DEPTH = {
    BG: 0,
    CARD: 10,
    GFX: 40
};

export const SETTINGS = {
    CAM_FOLLOW_LERP: 0.01,
    IS_TOUCH_SCREEN: false,
    SFX_VOLUJME: 0.7,
    MUSIC_VOLUME: 0.3,
    /**
     * Because games might somehow become more interesting.
     */
    MAX_NUM_CARDS_IN_PLAY: 2
};

/**
 * Ids for eveything game related.
 */
export const KEYS = {
    FONTS: {
        // CHANGA_ONE: 'ChangaOne',
        HOMER_LEARNING_BOLD: 'HOMERLearningFont Bold'
    },

    /**
     * Keys for sound effects in the game.
     */
    SFX: {
        /**
         * Key for the sprite containing all the game sounds.
         */
        ALL_SFX_SPRITE: 'sfx_sprite',

        CARD: 'card',
        MATCH1: 'match1',
        MATCH2: 'match2',
        NO_MATCH: 'no_match',
        BTN: 'btn',
        GAME_LOST: 'game_lost',
        GAME_WON: 'game_won',
        GAME_INSTR: 'game_instr',
        LOBBY_INSTR: 'lobby_instr'
    },

    MUSIC: {
        /**
         * One music for this project. Normally there are two or three tracks.
         */
        ALL: 'all'
    },
    /**
     * Atlas / Sprite sheet. 
     * - toast faces.
     * - plate.
     * - toaster and toaster button.
     * - back button.
     */
    ATLAS_SS1: 'ss1',
    JSON_DATA: 'json_data',
    ANIMS: {
        TOAST_LETTERS: 'toast',
    },

    CHECK: 'check',
    PLATE: 'plate0000',
    LOAF: 'toast0000',
    // LOAF_DISPENSER: 'loaf_dispenser0000',
    TOASTER: 'toaster0000',
    // TOASTER_BACK:'toaster_back0000',
    TOASTER_BTN: 'toasterButton0000',
    TOASTER_LETTER_BTN: 'toasterLetterButton0000',

    SCENE: {
        PRELOAD: 'preload_scene',
        LOAD: 'load_scene',
        LOBBY: 'lobby_scene',
        SOUND_UI: 'sound_ui',
        GAME: 'game_scene',
        GAME_PAUSED: 'game_paused_scene'
        // GAME_UI: 'game_ui'
    },

    LOGO_HERE: 'logo_here',

    BACKGROUND: 'background',

    UI: {
        BTN_BACK: 'backBtn0000'
    }
};

/**
 * The currently active Phaser.Scene.
 */
export let currentScene: Phaser.Scene;

/**
 * Set the currently active Phaser.Scene.
 * @param v the scene.
 */
export function setCurrentScene(v: Phaser.Scene) {
    currentScene = v;
}

/**
 * Triggers when the wind 'resize' event fires.
 * Calls the active scene's onResize (where defined) to adapt to the new window size.
 * @param new_width 
 * @param new_height 
 */
export function onWindowResize(new_width: number, new_height: number) {
    if (currentScene && currentScene.scale) {
        currentScene.scale.resize(new_width, new_height);
        //@ts-ignore.
        if (currentScene.onResize) {
            //@ts-ignore.
            currentScene.onResize.apply(currentScene);
        }
    }
};

/**
 * Shared scene stuff, or shared stuff between scenes.
 * States that are of interest to more than one scene,
 * can be conveniently found here.
 */
export const SHARED = {
    lobbyInstrPlayed: false,
    gameInstrPlayed: false
}

/**
 * Shared sound manager to easilly play sounds in any scene.
 */
// export const soundManager: SoundManager = new SoundManager();

/**
 * Shared musicManager to easilly play music in any scene.
 */
// export const musicManager: MusicManager = new MusicManager();


/**
 * Describes a game data object that is expected to be extracted from a json file (e.g.: audios.json).
 * Provides code completion when using the data.
 */
interface iGameData {
    words: string[]
    phrases: {
        corrects: string[]
        intros: string[]
        outros: string[]
        prompts: string[]
    }
}