import express from "express";
import { GameApi } from "./game/game.api";
import { UserApi } from "./user/user.api";

export class Api {
    static init(app: express.Application): void {
        app.get('/health', Api.healthCheck);
        GameApi.init(app);
        UserApi.init(app);
    }

    private static healthCheck(req: any, res: any): void {
        res.send({ succeed: true, message: 'Tic Tak Toe server is UP' });
    }
}