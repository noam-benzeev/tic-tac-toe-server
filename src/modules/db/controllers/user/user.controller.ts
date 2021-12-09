import { Transaction } from "sequelize/dist";
import { DB } from "../..";
import { CreateUser, User } from "../../../../types/interfaces/user";
import { Logger } from "../../../logger/logger";

export class UserController {
    static async getAllUsers(transaction?: Transaction): Promise<User[] | null> {
        let users: User[] | null = null;
        try {
            users = await DB.models.user.findAll({...(transaction && {transaction})});
        } catch (error: any) {
            Logger.error(`Faild to get all users from DB. ${error}`, 'UserController.getAllUsers');
        }
        return users;
    }

    static async getGameUsers(gameId: number, transaction?: Transaction): Promise<User[] | null> {
        let users: User[] | null = null;
        try {
            users = await DB.models.user.findAll({
                where: {currentGameId: gameId},
                ...(transaction && {transaction})
            });
        } catch (error: any) {
            Logger.error(`Faild to get game users from DB. ${error}`, 'UserController.getGameUsers');
        }
        return users;
    }

    static async getUserById(id:number, transaction?: Transaction): Promise<User | null> {
        let user: User | null = null;
        try {
            user = await DB.models.user.findByPk(id, {...(transaction && {transaction})});
        } catch (error: any) {
            Logger.error(`Faild to get user with id '${id}' From DB. ${error}`, 'UserController.getUserById');
        }
        return user;
    }

    static async createUser(newUser: CreateUser, transaction?: Transaction): Promise<User | null> {
        let createdUser: User | null = null;
        try {
            createdUser = await DB.models.user.create(newUser, {...(transaction && {transaction})});
        } catch (error: any) {
            Logger.error(`Faild to create new user in DB. User data: ${JSON.stringify(newUser)}. ${error}`, 'UserController.createUser');
        }
        return createdUser;
    }

    static async updateUser(userId:number, updatedFields: Partial<User>, transaction?: Transaction): Promise<boolean> {
        let succeed: boolean = false;
        try {            
            succeed = !!(await DB.models.user.update(updatedFields, {
                where: {id: userId},
                ...(transaction && {transaction})
            }))[0];
        } catch (error: any) {
            Logger.error(`Faild to update user (id: ${userId}) in DB. Update fields: ${JSON.stringify(updatedFields)}. ${error}`, 'UserController.updateUser');
        }
        return succeed;
    }

    static async deleteUser(userId: number, transaction?: Transaction): Promise<boolean> {
        let succeed: boolean = false;
        try {
            succeed = !!(await DB.models.user.destroy({
                where: {id: userId},
                ...(transaction && {transaction})
            }));
        } catch (error: any) {
            Logger.error(`Faild to delete user. User id: ${userId}. ${error}`, 'UserController.deleteUser');
        }
        return succeed;
    }
}