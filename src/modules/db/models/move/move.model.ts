import * as Sequelize from 'sequelize';

export const move = (sequelize: Sequelize.Sequelize) => sequelize.define("move", {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },
    gameId: {
        type: Sequelize.INTEGER,
        field: 'game_id',
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        field: 'user_id',
        allowNull: false
    },
    row: {
        type: Sequelize.INTEGER,
        field: 'row',
        allowNull: false
    },
    col: {
        type: Sequelize.INTEGER,
        field: 'col',
        allowNull: false
    }
}, {
    tableName: 'moves'
});
