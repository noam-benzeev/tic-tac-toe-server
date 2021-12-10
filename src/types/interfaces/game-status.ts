import { GameStatusOptions } from "../enums/game-status";

export interface GameStatus {
    status: GameStatusOptions;
    winner?: number;
}