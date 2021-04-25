/**
 * Provides code completion for the game data json file.
 */
export interface iGameData {
    words: string[]
    phrases: {
        intros: string[]
        outros: string[]
        corrects: string[]
        prompts: string[]
    }
}