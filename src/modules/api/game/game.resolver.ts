import { Transaction } from "sequelize/dist";
import { GameModeStatus } from "../../../types/enums/gameModeStatus";
import { User } from "../../../types/interfaces/user";
import { Game } from "../../../types/interfaces/game";
import { CreateMove } from "../../../types/interfaces/move";
import { DB } from "../../db";
import { GameController } from "../../db/controllers/game/game.controller";
import { UserController } from "../../db/controllers/user/user.controller";
import { MoveController } from "../../db/controllers/move/move.controller";

const PLAYERS_PER_GAME: number = 2;

export class GameResolver {
    static async handleCreateGame(userId: number): Promise<boolean> {
        let succeed: boolean = false;
        const transaction: Transaction = await DB.sequelize.transaction();
        const user: User | null = await UserController.getUserById(userId, transaction);
        let newGame: Game | null = null;
        (user && !user.currentGameId) && (newGame = await GameController.createGame(transaction));

        if (newGame) {
            const succeedUpdateUser: boolean = await UserController.updateUser(userId, { currentGameId: newGame.id }, transaction);
            if (succeedUpdateUser) {
                transaction.commit();
                succeed = true;
            } else {
                transaction.rollback();
            }
        }
        return succeed;
    }

    static async handleJoinToGame(userId: number, gameId: number): Promise<boolean> {
        let succeed: boolean = false;
        if (await GameResolver.validateJoinToGame(userId, gameId)) {
            const transaction: Transaction = await DB.sequelize.transaction();
            await UserController.updateUser(userId, { currentGameId: gameId }, transaction);
            const gameUsers: User[] | null = await UserController.getGameUsers(gameId, transaction);
            if (gameUsers && gameUsers.length === PLAYERS_PER_GAME) {
                succeed = await GameController.updateGame(gameId, { isActive: true, nextMove: GameResolver.chooseStartingUser(gameUsers) }, transaction);
                succeed ? transaction.commit() : transaction.rollback();
            }
        }
        return succeed;
    }

    static async handleMakeMove(createMove: CreateMove): Promise<boolean> {
        let succeed: boolean = false;
        if (await GameResolver.validateMakeMove(createMove)) {
            const createdMove = await MoveController.createMove(createMove);
            (createdMove && GameResolver.updateGameByNewMove(createMove.gameId)) && (succeed = true);
        }
        return succeed;
    }

    private static async updateGameByNewMove(gameId: number): Promise<boolean> {
        return true
    }

    private static async validateJoinToGame(userId: number, gameId: number): Promise<boolean> {
        const user: User | null = await UserController.getUserById(userId);
        const gameModeStatus: GameModeStatus = await GameController.getGameModeStatusById(gameId);
        return !!user && !user.currentGameId && gameModeStatus === GameModeStatus.PENDING;
    }

    private static async validateMakeMove({userId, gameId, ...location}: CreateMove): Promise<boolean> {
        let isValid: boolean = false;
        const user: User | null = await UserController.getUserById(userId);
        const game: Game | null = await GameController.getGameById(gameId);

        const isUserInGame: boolean = !!user && user.currentGameId === gameId;
        const isGameActive: boolean = !!game && game.isActive;
        if (isUserInGame && isGameActive) {
            const isUserTurn: boolean = (game as Game).nextMove === userId;
            const isMoveAlreadyExist: boolean | null = await MoveController.checkExistingMove(gameId, location);
            (isUserTurn && isMoveAlreadyExist === false) && (isValid = true);
        }
        return isValid;
    }

    private static chooseStartingUser(gameUsers: User[]): number {
        const randomIndex: number = Math.floor(Math.random() * PLAYERS_PER_GAME);
        return gameUsers[randomIndex].id;
    }
}