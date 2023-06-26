const { DataTypes } = require("sequelize");
const sequelize = require("../database/dbConnection");

const Group = sequelize.define("ChatGroup", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    groupName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Group;
