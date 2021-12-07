import { DB } from "..";
import { Game } from "../../../types/interfaces/game";
import { Logger } from "../../logger/logger";

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

    static async createGame(): Promise<boolean> {
        let succeed: boolean = false;
        try {
            await DB.models.game.create();
            succeed = true;
        } catch (error: any) {
            Logger.error(`Faild to create new game in DB. Error: ${error}`, 'GameController.createGame');
        }
        return succeed;
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