import * as Sequelize from 'sequelize';

export const user = (sequelize: Sequelize.Sequelize) => sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        field: 'name',
        allowNull: false
    },
    currentGameId: {
        type: Sequelize.INTEGER,
        field: 'current_game_id',
        allowNull: true
    }
}, {
    tableName: 'users'
});
