import express from "express";
import { GameModeStatus } from "../../../types/enums/gameModeStatus";
import { Status } from "../../../types/enums/status";
import { Game } from "../../../types/interfaces/game";
import { User } from "../../../types/interfaces/user";
import { GameController } from "../../db/controllers/game/game.controller";
import { UserController } from "../../db/controllers/user/user.controller";
import { Logger } from "../../logger/logger";

export class GameApi {
    static init(app: express.Application): void {
        app.get('/api/games/pendings', GameApi.getPendingsGames);
        app.get('/api/games/status/:id', () => { });
        app.post('/api/games/create', GameApi.create);
        app.post('/api/games/join', GameApi.joinToGame);
    }

    private static async getPendingsGames(req: any, res: any): Promise<void> {
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
        const user: User | null = await UserController.getUserById(userId);
        let newGame: Game | null = null;
        (user && !user.currentGame) && (newGame = await GameController.createGame());

        if (newGame) {
            await UserController.updateUser(userId, {currentGame: newGame.id});
            res.send({ succeed: true });
            Logger.debug(`Succeed to create new game by user. User Id '${userId}'`, 'GameApi.create');
        } else {
            res.status(Status.ERROR).send({
                succeed: false,
                message: 'Error occurred while creating new game by user'
            });
        }
    }

    private static async joinToGame(req: any, res: any): Promise<void> {
        const {userId, gameId}: {userId: number, gameId: number} = req.body;
        Logger.info(`Got request to add user (${userId}) to game (${gameId})`, 'GameApi.joinToGame');
        const user: User | null = await UserController.getUserById(userId);
        const gameModeStatus: GameModeStatus = await GameController.getGameModeStatusById(gameId);

        if (user && !user.currentGame && gameModeStatus === GameModeStatus.PENDING) {
            await UserController.updateUser(userId, {currentGame: gameId});
            await GameController.updateGame(userId, {isActive: true});
            res.send({ succeed: true });
            Logger.debug(`Succeed adding user (${userId}) to game (${gameId})`, 'GameApi.joinToGame');
        } else {
            res.status(Status.ERROR).send({
                succeed: false,
                message: 'Error occurred while adding user to game'
            });
        }
    }
}
