import { dbConfig } from './config/db-config';
import { game } from './models/game/game.model';
import { move } from './models/move/move.model';
import { user } from './models/user/user.model';
const Sequelize = require('sequelize');

export class DB {
    static models: any;
    private static sequelize: any;

    static init(): void {
        DB.initConfig();
        DB.initModels();
        DB.sequelize.sync().then(() => {
            console.log(`Succeed connect to Database`);
        });
    }

    private static initConfig(): void {
        DB.sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
            logging: false,
            host: dbConfig.HOST,
            dialect: dbConfig.dialect,
            pool: {
                max: dbConfig.pool.max,
                min: dbConfig.pool.min,
                acquire: dbConfig.pool.acquire,
                idle: dbConfig.pool.idle
            }
        });
    }

    private static initModels(): void {
        DB.models = {
            Sequelize,
            sequelize: DB.sequelize,
            game: game(DB.sequelize, Sequelize),
            user: user(DB.sequelize, Sequelize),
            move: move(DB.sequelize, Sequelize)
        };
    }
}
