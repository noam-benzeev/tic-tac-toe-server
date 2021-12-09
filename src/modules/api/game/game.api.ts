import express from "express";
import { Status } from "../../../types/enums/status";
import { Game } from "../../../types/interfaces/game";
import { CreateMove } from "../../../types/interfaces/move";
import { GameController } from "../../db/controllers/game/game.controller";
import { Logger } from "../../logger/logger";
import { GameResolver } from "./game.resolver";

export class GameApi {
    static init(app: express.Application): void {
        app.get('/api/games/pendings', GameApi.getPendingsGames);
        app.get('/api/games/status/:id', () => { });
        app.post('/api/games/create', GameApi.create);
        app.post('/api/games/join', GameApi.joinToGame);
        app.post('/api/games/move', GameApi.makeMove);
    }

    private static async getPendingsGames(_: any, res: any): Promise<void> {
        Logger.info('Got request to get pendings games', 'GameApi.getPendingsGames');
        const games: Game[] | null = await GameController.getPendingsGames();
        if (games) {
            res.send({ succeed: true, data: games });
            Logger.debug('Succeed to get pendings games', 'GameApi.getPendingsGames');
        } else {
            res.status(Status.ERROR).send({
                succeed: false,
                message: 'Error occurred while getting pendings games'
            });
        }
    }

    private static async create(req: any, res: any): Promise<void> {
        const userId: number = req.body.userId;
        Logger.info(`Got request to create new game by user. User Id '${userId}'`, 'GameApi.create');
        if (await GameResolver.handleCreateGame(userId)) {
            res.send({ succeed: true });
            Logger.debug(`Succeed to create new game by user. User Id '${userId}'`, 'GameApi.create');
        } else {
            res.status(Status.ERROR).send({
                succeed: false,
                message: 'Error occurred while creating new game by user'
            });
            Logger.warn(`Failed handling create game. User Id '${userId}'`, 'GameApi.create');
        }
    }

    private static async joinToGame(req: any, res: any): Promise<void> {
        const {userId, gameId}: {userId: number, gameId: number} = req.body;
        Logger.info(`Got request to add user (${userId}) to game (${gameId})`, 'GameApi.joinToGame');
        if (await GameResolver.handleJoinToGame(userId, gameId)) {
            res.send({ succeed: true });
            Logger.debug(`Succeed adding user (${userId}) to game (${gameId})`, 'GameApi.joinToGame');
        } else {
            res.status(Status.ERROR).send({
                succeed: false,
                message: 'Error occurred while adding user to game'
            });
            Logger.warn(`Failed adding user (${userId}) to game (${gameId})`, 'GameApi.joinToGame');
        }
    }

    private static async makeMove(req: any, res: any): Promise<void> {
        const createMove: CreateMove = req.body;
        Logger.info(`Got request to make move by user (${createMove.userId}) in game (${createMove.gameId})`, 'GameApi.makeMove');
        if (await GameResolver.handleMakeMove(createMove)) {
            res.send({ succeed: true });
            Logger.debug(`Succeed making move by user (${createMove.userId}) in game (${createMove.gameId})`, 'GameApi.makeMove');
        } else {
            res.status(Status.ERROR).send({
                succeed: false,
                message: 'Error occurred while tring to make move in game'
            });
            Logger.warn(`Failed making move by user (${createMove.userId}) in game (${createMove.gameId}). Data: ${JSON.stringify(createMove)}`, 'GameApi.makeMove');
        }
    }
}
