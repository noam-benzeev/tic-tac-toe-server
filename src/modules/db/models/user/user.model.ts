export const user = (sequelize: any, Sequelize: any) => sequelize.define("user", {
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
    currentGame: {
        type: Sequelize.INTEGER,
        field: 'current_game',
        allowNull: true
    }
}, {
    tableName: 'Users'
});
