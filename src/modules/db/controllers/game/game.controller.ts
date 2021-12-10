import { Transaction } from "sequelize/dist";
import { DB } from "../..";
import { GameStatusOptions } from "../../../../types/enums/game-status";
import { Game } from "../../../../types/interfaces/game";
import { GameStatus } from "../../../../types/interfaces/game-status";
import { Logger } from "../../../logger/logger";
import { user } from "../../models/user/user.model";

export class GameController {
    static async getPendingsGames(transaction?: Transaction): Promise<Game[] | null> {
        let openGames: Game[] | null = null;
        try {
            openGames = await DB.models.game.findAll({
                where: {
                    isActive: false,
                    isFinished: false
                },
                ...(transaction && {transaction})
            });
        } catch (error: any) {
            Logger.error(`Faild to get pendings games from DB. ${error}`, 'GameController.getAllOpenGames');
        }
        return openGames;
    }

    static async getGameById(id:number, transaction?: Transaction): Promise<Game | null> {
        let game: Game | null = null;
        try {
            game = await DB.models.game.findByPk(id, {...(transaction && {transaction})});
        } catch (error: any) {
            Logger.error(`Faild to get game with id '${id}' From DB. ${error}`, 'GameController.getGameById');
        }
        return game;
    }

    static async getGameStatusById(id:number, transaction?: Transaction): Promise<GameStatus> {
        const game: Game | null = await GameController.getGameById(id, transaction);
        let status: GameStatusOptions = GameStatusOptions.NOT_EXIST;
        if (game) {
            if (!game.isActive && !game.isFinished) {
                status = GameStatusOptions.PENDING;
            } else if (game.isActive) {
                status = GameStatusOptions.ACTIVE;
            } else if (game.isFinished) {
                status = GameStatusOptions.FINISH;
            }
        }
        return {status, ...(game?.winner && {winner: game.winner})};
    }

    static async createGame(transaction?: Transaction): Promise<Game | null> {
        let createdGame: Game | null = null;
        try {
            createdGame = await DB.models.game.create({}, {...(transaction && {transaction})});
        } catch (error: any) {
            Logger.error(`Faild to create new game in DB. ${error}`, 'GameController.createGame');
        }
        return createdGame;
    }

    static async updateGame(gameId:number, updatedFields: Partial<Game>, transaction?: Transaction): Promise<boolean> {
        let succeed: boolean = false;
        try {
            succeed = !!(await DB.models.game.update(updatedFields, {
                where: {id: gameId},
                ...(transaction && {transaction})
            }))[0];
        } catch (error: any) {
            Logger.error(`Faild to update game (id: ${gameId}) in DB. Update fields: ${JSON.stringify(updatedFields)}. ${error}`, 'UserController.updateUser');
        }
        return succeed;
    }
}