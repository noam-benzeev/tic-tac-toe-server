import { DB } from "../..";
import { User } from "../../../../types/interfaces/user";
import { Logger } from "../../../logger/logger";

export class UserController {
    static async getAllUsers(): Promise<User[] | null> {
        let users: User[] | null = null;
        try {
            users = await DB.models.user.findAll();
        } catch (error: any) {
            Logger.error(`Faild to get all users from DB. Error: ${error}`, 'UserController.getAllUsers');
        }
        return users;
    }

    static async getUserById(id:number): Promise<User | null> {
        let user: User | null = null;
        try {
            user = await DB.models.user.findByPk(id);
        } catch (error: any) {
            Logger.error(`Faild to get user with id '${id}' From DB. Error: ${error}`, 'UserController.getUserById');
        }
        return user;
    }

    static async createUser(newUser: User): Promise<User | null> {
        let createdUser: User | null = null;
        try {
            createdUser = await DB.models.user.create(newUser);
        } catch (error: any) {
            Logger.error(`Faild to create new user in DB. User data: ${JSON.stringify(newUser)}. Error: ${error}`, 'UserController.createUser');
        }
        return createdUser;
    }

    static async updateUser(userId:number, updatedFields: Partial<User>): Promise<boolean> {
        let succeed: boolean = false;
        try {
            succeed = !!(await DB.models.user.update(updatedFields, {
                where: {id: userId}
            }))[0];
        } catch (error: any) {
            Logger.error(`Faild to update user (id: ${userId}) in DB. Update fields: ${JSON.stringify(updatedFields)}. Error: ${error}`, 'UserController.updateUser');
        }
        return succeed;
    }

    static async deleteUser(userId: number): Promise<boolean> {
        let succeed: boolean = false;
        try {
            succeed = !!(await DB.models.user.destroy({
                where: {id: userId}
            }));
        } catch (error: any) {
            Logger.error(`Faild to delete user. User id: ${userId}. Error: ${error}`, 'UserController.deleteUser');
        }
        return succeed;
    }
}