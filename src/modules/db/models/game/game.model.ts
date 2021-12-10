import * as Sequelize from 'sequelize';

export const game = (sequelize: Sequelize.Sequelize) => sequelize.define("game", {
    id: {
        type: Sequelize.INTEGER,
        field: 'id',
        primaryKey: true,
        autoIncrement: true
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        field: 'is_active',
        defaultValue: false
    },
    isFinished: {
        type: Sequelize.BOOLEAN,
        field: 'is_finished',
        defaultValue: false
    },
    nextMove: {
        type: Sequelize.INTEGER,
        field: 'next_move',
        allowNull: true
    },
    winner: {
        type: Sequelize.INTEGER,
        field: 'winner',
        allowNull: true
    }
}, {
    tableName: 'games'
});
