export interface CreateUser {
    name: string;
}

export interface User extends CreateUser {
    id: number;
    currentGameId: number | null;
}