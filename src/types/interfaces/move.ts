export interface CreateMove {
    gameId: number;
    userId: number;
    row: number;
    col: number;
}

export interface Move extends CreateMove {
    id: number;
}