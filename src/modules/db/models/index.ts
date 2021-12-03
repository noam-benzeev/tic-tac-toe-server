import { dbConfig } from '../config/db-config';
import { game } from './game/game.model';
import { move } from './move/move.model';
import { user } from './user/user.model';
const Sequelize = require('sequelize');

export class DB {
    static db: any;
    private static sequelize: any;

    static init(): void {
        DB.initConfig();
        DB.initModels();
        DB.sequelize.sync({ force: true }).then(() => {
            console.log(`Database & tables created!`);
        });
    }

    private static initConfig(): void {
        DB.sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
            host: dbConfig.HOST,
            dialect: dbConfig.dialect,
            operatorsAliases: false,
            pool: {
                max: dbConfig.pool.max,
                min: dbConfig.pool.min,
                acquire: dbConfig.pool.acquire,
                idle: dbConfig.pool.idle
            }
        });
    }

    private static initModels(): void {
        DB.db = {
            Sequelize,
            sequelize: DB.sequelize,
            game: game(DB.sequelize, Sequelize),
            user: user(DB.sequelize, Sequelize),
            move: move(DB.sequelize, Sequelize)
        };
    }
}
