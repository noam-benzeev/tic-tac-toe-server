import { DB } from "../..";
import { GameModeStatus } from "../../../../types/enums/gameModeStatus";
import { Game } from "../../../../types/interfaces/game";
import { Logger } from "../../../logger/logger";

export class GameController {
    static async getPendingsGames(): Promise<Game[] | null> {
        let openGames: Game[] | null = null;
        try {
            openGames = await DB.models.game.findAll({
                where: {
                    is_active: false,
                    is_finished: false
                }
            });
        } catch (error: any) {
            Logger.error(`Faild to get pendings games from DB. Error: ${error}`, 'GameController.getAllOpenGames');
        }
        return openGames;
    }

    static async getGameById(id:number): Promise<Game | null> {
        let game: Game | null = null;
        try {
            game = await DB.models.game.findByPk(id);
        } catch (error: any) {
            Logger.error(`Faild to get game with id '${id}' From DB. Error: ${error}`, 'GameController.getGameById');
        }
        return game;
    }

    static async getGameModeStatusById(id:number): Promise<GameModeStatus> {
        const game: Game | null = await GameController.getGameById(id);
        let status: GameModeStatus = GameModeStatus.NOT_EXIST;
        if (game) {
            if (!game.isActive && !game.isFinished) {
                status = GameModeStatus.PENDING;
            } else if (game.isActive) {
                status = GameModeStatus.ACTIVE;
            } else if (game.isFinished) {
                status = GameModeStatus.FINISH;
            }
        }
        return status;
    }

    static async createGame(): Promise<Game | null> {
        let createdGame: Game | null = null;
        try {
            createdGame = await DB.models.game.create();
        } catch (error: any) {
            Logger.error(`Faild to create new game in DB. Error: ${error}`, 'GameController.createGame');
        }
        return createdGame;
    }

    static async updateGame(gameId:number, updatedFields: Partial<Game>): Promise<boolean> {
        let succeed: boolean = false;
        try {
            succeed = !!(await DB.models.game.update(updatedFields, {
                where: {id: gameId}
            }))[0];
        } catch (error: any) {
            Logger.error(`Faild to update game (id: ${gameId}) in DB. Update fields: ${JSON.stringify(updatedFields)}. Error: ${error}`, 'UserController.updateUser');
        }
        return succeed;
    }
}