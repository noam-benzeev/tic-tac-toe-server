import express from "express";
import { Status } from "../../../types/enums/status";
import { User } from "../../../types/interfaces/user";
import { UserController } from "../../db/controllers/user/user.controller";
import { Logger } from "../../logger/logger";

export class UserApi {
    static init(app: express.Application): void {
        app.get('/api/users', UserApi.getAll);
        app.get('/api/users/:id', UserApi.getById);
        app.post('/api/users/create', UserApi.create);
        app.post('/api/users/update', UserApi.update);
        app.post('/api/users/delete', UserApi.delete);
    }

    private static async getAll(_: any, res: any): Promise<void> {
        Logger.info('Got request to get all users', 'UserApi.getAll');
        const users: User[] | null = await UserController.getAllUsers();
        if (users) {
            res.send({ succeed: true, data: users });
            Logger.debug('Succeed to get all users', 'UserApi.getAll');
        } else {
            res.status(Status.ERROR).send({
                succeed: false,
                message: 'Error occurred while getting all users'
            });
        }
    }

    private static async getById(req: any, res: any): Promise<void> {
        const id: number = req.params.id;
        Logger.info(`Got request to get user with id '${id}'`, 'UserApi.getById');
        const user: User | null = await UserController.getUserById(id);
        if (user) {
            res.send({ succeed: true, data: user });
            Logger.debug(`Succeed to get user with id '${id}'`, 'UserApi.getById');
        } else {
            res.status(Status.ERROR).send({
                succeed: false,
                message: 'Error occurred while getting user'
            });
            Logger.warn(`Faild to get user with id '${id}'`, 'UserApi.create');
        }
    }

    private static async create(req: any, res: any): Promise<void> {
        const newUser: User = req.body;
        Logger.info(`Got request to create new user. User name: ${newUser.name}`, 'UserApi.create');
        const createdUser: User | null = await UserController.createUser(newUser);
        if (createdUser) {
            res.send({ succeed: true });
            Logger.debug(`Succeed to create new user. User name: ${newUser.name}`, 'UserApi.create');
        } else {
            res.status(Status.ERROR).send({
                succeed: false,
                message: 'Error occurred while creating the user'
            });
            Logger.warn(`Faild to create new user. User: ${JSON.stringify(newUser)}`, 'UserApi.create');
        }
    }

    private static async update(req: any, res: any): Promise<void> {
        const { id, fields }: { id: number, fields: Partial<User> } = req.body;
        Logger.info(`Got request to update user. User id: ${id}`, 'UserApi.update');
        const succeed: boolean = await UserController.updateUser(id, fields);
        if (succeed) {
            res.send({ succeed });
            Logger.debug(`Succeed to update user. User id: ${id}`, 'UserApi.update');
        } else {
            res.status(Status.ERROR).send({
                succeed,
                message: 'Error occurred while updating the user'
            });
            Logger.warn(`Faild to update user (id: ${id}). Update fields: ${JSON.stringify(fields)}`, 'UserApi.update');
        }
    }

    private static async delete(req: any, res: any): Promise<void> {
        const id: number = req.body.id;
        Logger.info(`Got request to delete user. User id: ${id}`, 'UserApi.delete');
        const succeed: boolean = await UserController.deleteUser(id);
        if (succeed) {
            res.send({ succeed });
            Logger.debug(`Succeed to delete user. User id: ${id}`, 'UserApi.delete');
        } else {
            res.status(Status.ERROR).send({
                succeed,
                message: 'Error occurred while deleting the user'
            });
            Logger.warn(`Faild to delete user. User id: ${id}`, 'UserApi.delete');
        }
    }
}
