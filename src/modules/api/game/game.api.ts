import express from "express";
import { Status } from "../../../types/enums/status";
import { Game } from "../../../types/interfaces/game";
import { GameController } from "../../db/controllers/game.controller";
import { Logger } from "../../logger/logger";

export class GameApi {
    static init(app: express.Application): void {
        app.get('/api/games/pendings', GameApi.getPendingsGames);
        app.get('/api/games/status/:id', () => {});
        app.post('/api/games/create', GameApi.create);
    }

    private static async getPendingsGames(req: any, res: any): Promise<void> {
        Logger.info('Got request to get pendings games', 'GameApi.getPendingsGames');
        const games: Game[] | null = await GameController.getPendingsGames();
        if (games) {
            res.send({succeed: true, data: games});
            Logger.debug('Succeed to get pendings games', 'GameApi.getPendingsGames');
        } else {
            res.status(Status.ERROR).send({
                succeed: false,
                message: "Error occurred while getting pendings games"
            });
        }
    }

    private static async create(req: any, res: any): Promise<void> {
        Logger.info('Got request to create new game', 'GameApi.create');
        const succeed: boolean = await GameController.createGame();
        if (succeed) {
            res.send({succeed});
            Logger.debug(`Succeed to create new game`, 'GameApi.create');
        } else {
            res.status(Status.ERROR).send({
                succeed,
                message: "Error occurred while creating the game"
            });
        }
    }
}
