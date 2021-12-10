import { Transaction } from "sequelize/dist";
import { GameStatusOptions } from "../../../types/enums/game-status";
import { User } from "../../../types/interfaces/user";
import { Game } from "../../../types/interfaces/game";
import { Move, CreateMove } from "../../../types/interfaces/move";
import { DB } from "../../db";
import { GameController } from "../../db/controllers/game/game.controller";
import { UserController } from "../../db/controllers/user/user.controller";
import { MoveController } from "../../db/controllers/move/move.controller";
import { Location } from "../../../types/interfaces/location";
import { GameStatus } from "../../../types/interfaces/game-status";

const PLAYERS_PER_GAME: number = 2;
const GAME_BOARD_SIZE: number = 3;

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
            const transaction: Transaction = await DB.sequelize.transaction();
            const createdMove: Move | null = await MoveController.createMove(createMove, transaction);
            (createdMove && await GameResolver.updateGameByNewMove(createdMove, transaction)) && (succeed = true);
        }
        return succeed;
    }

    private static async updateGameByNewMove(newMove: Move, transaction?: Transaction): Promise<boolean> {
        const gameMoves: Move[] | null = await MoveController.getAllGameMoves(newMove.gameId, transaction);
        let succeed: boolean = !!gameMoves;
        if (gameMoves) {
            const newGameStatus: GameStatus = GameResolver.checkGameFinished(newMove, gameMoves);
            if (newGameStatus.status === GameStatusOptions.FINISH) {
                succeed = await GameController.updateGame(newMove.gameId, {
                    isActive: false,
                    isFinished: true,
                    ...(newGameStatus.winner && { winner: newGameStatus.winner })
                }, transaction);          
                succeed && (succeed = await UserController.updateUsers(newMove.gameId, { currentGameId: null }, transaction));
            } else {
                succeed = await GameResolver.updateNextMove(newMove, transaction);
            }
        }
        transaction && (succeed ? transaction.commit() : transaction.rollback());
        return succeed;
    }

    private static async updateNextMove({ userId, gameId }: Move, transaction?: Transaction): Promise<boolean> {
        let succeed: boolean = false;
        const gameUsers: User[] | null = await UserController.getGameUsers(gameId, transaction);
        if (gameUsers && gameUsers.length === PLAYERS_PER_GAME) {
            const nextMoveUser: User | undefined = gameUsers.find(({ id }: User) => id !== userId);
            succeed = await GameController.updateGame(gameId, { nextMove: nextMoveUser?.id }, transaction);
        }
        return succeed;
    }

    private static checkGameFinished(newMove: Move, gameMoves: Move[]): GameStatus {
        let newGameStatus: GameStatus = { status: GameStatusOptions.ACTIVE };
        const gameBoard: number[][] = GameResolver.generateGameBoard(gameMoves);
        if (GameResolver.checkRow(newMove, gameBoard) ||
            GameResolver.checkColumn(newMove, gameBoard) ||
            GameResolver.checkSlants(newMove, gameBoard)) {
            newGameStatus = { status: GameStatusOptions.FINISH, winner: newMove.userId };
        } else if (gameMoves.length === Math.pow(GAME_BOARD_SIZE, 2)) {
            newGameStatus = { status: GameStatusOptions.FINISH };
        }
        return newGameStatus;
    }

    private static checkRow({ col, userId }: Move, gameBoard: number[][]): boolean {
        return gameBoard.every((row: number[]) => row[col] === userId);
    }

    private static checkColumn({ row, userId }: Move, gameBoard: number[][]): boolean {
        return gameBoard[row].every((cell: number) => cell === userId);
    }

    private static checkSlants(newMove: Move, gameBoard: number[][]): boolean {
        let isGameFinished: boolean = false;
        if (newMove.row === newMove.col) {
            isGameFinished = gameBoard.every((row: number[], index: number) => row[index] === newMove.userId);
        }
        if (GAME_BOARD_SIZE - 1 - newMove.row === newMove.col) {
            isGameFinished = gameBoard.every((row: number[], index: number) => row[GAME_BOARD_SIZE - 1 - index] === newMove.userId);
        }
        return isGameFinished;
    }

    private static async validateJoinToGame(userId: number, gameId: number): Promise<boolean> {
        const user: User | null = await UserController.getUserById(userId);
        const { status }: GameStatus = await GameController.getGameStatusById(gameId);
        return !!user && !user.currentGameId && status === GameStatusOptions.PENDING;
    }

    private static async validateMakeMove({ userId, gameId, ...location }: CreateMove): Promise<boolean> {
        let isValid: boolean = false;
        const user: User | null = await UserController.getUserById(userId);
        const game: Game | null = await GameController.getGameById(gameId);

        const isUserInGame: boolean = !!user && user.currentGameId === gameId;
        const isGameActive: boolean = !!game && game.isActive;
        if (isUserInGame && isGameActive && GameResolver.isMoveInBoard(location)) {
            const isUserTurn: boolean = (game as Game).nextMove === userId;
            const isMoveAlreadyExist: boolean | null = await MoveController.checkExistingMove(gameId, location);
            (isUserTurn && isMoveAlreadyExist === false) && (isValid = true);
        }
        return isValid;
    }

    private static generateGameBoard(gameMoves: Move[]): number[][] {
        const emptyGameBoard: number[][] = new Array(GAME_BOARD_SIZE).fill(null).map(() => new Array(GAME_BOARD_SIZE).fill(null));
        return gameMoves.reduce((result: number[][], move: Move) => {
            result[move.row][move.col] = move.userId;
            return result;
        }, emptyGameBoard);
    }

    private static chooseStartingUser(gameUsers: User[]): number {
        const randomIndex: number = Math.floor(Math.random() * PLAYERS_PER_GAME);
        return gameUsers[randomIndex].id;
    }

    private static isMoveInBoard({ row, col }: Location): boolean {
        return row >= 0 && row < GAME_BOARD_SIZE && col >= 0 && col < GAME_BOARD_SIZE;
    }
}