export interface Game {
    id: number;
    isActive: boolean;
    isFinished: boolean;
    nextMove?: number;
    winner?: number;
}