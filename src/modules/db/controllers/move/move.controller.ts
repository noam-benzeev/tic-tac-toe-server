import { Transaction } from "sequelize/dist";
import { DB } from "../..";
import { Location } from "../../../../types/interfaces/location";
import { CreateMove, Move } from "../../../../types/interfaces/move";
import { Logger } from "../../../logger/logger";

export class MoveController {
    static async getAllGameMoves(gameId: number, transaction?: Transaction): Promise<Move[] | null> {
        let moves: Move[] | null = null;
        try {
            moves = await DB.models.move.findAll({
                where: {gameId},
                ...(transaction && {transaction})
            });
        } catch (error: any) {
            Logger.error(`Faild to get all game's moves from DB. ${error}`, 'MoveController.getAllGameMoves');
        }
        return moves;
    }

    static async checkExistingMove(gameId: number, {row, col}: Location, transaction?: Transaction): Promise<boolean | null> {
        let isExist: boolean | null = null;
        try {
            isExist = !!(await DB.models.move.count({
                where: {gameId, row, col},
                ...(transaction && {transaction})
            }));
        } catch (error: any) {
            Logger.error(`Faild to check if move (row: ${row}, col: ${col}) exist in game (${gameId}) from DB. ${error}`, 'MoveController.checkExistingMove');
        }
        return isExist;
    }

    static async createMove(newMove: CreateMove, transaction?: Transaction): Promise<Move | null> {
        let createdMove: Move | null = null;
        try {
            createdMove = await DB.models.move.create(newMove, {...(transaction && {transaction})});
        } catch (error: any) {
            Logger.error(`Faild to create new move in DB. Move data: ${JSON.stringify(newMove)}. ${error}`, 'MoveController.createMove');
        }
        return createdMove;
    }

    static async deleteMove(moveId: number, transaction?: Transaction): Promise<boolean> {
        let succeed: boolean = false;
        try {
            succeed = !!(await DB.models.move.destroy({
                where: {id: moveId},
                ...(transaction && {transaction})
            }));
        } catch (error: any) {
            Logger.error(`Faild to delete move. Move id: ${moveId}. ${error}`, 'MoveController.deleteMove');
        }
        return succeed;
    }
}