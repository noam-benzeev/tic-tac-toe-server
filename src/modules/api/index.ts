import express from "express";
import { GameApi } from "./game/game.api";
import { UserApi } from "./user/user.api";

export class Api {
    static init(app: express.Application): void {
        GameApi.init(app);
        UserApi.init(app);
        app.get('/health', Api.healthCheck);
    }

    private static healthCheck(req: any, res: any): void {
        res.json({ message: 'Tic Tak Toe server is UP' });
    }
}