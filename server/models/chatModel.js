const sequelize = require("../database/dbConnection");
const { DataTypes } = require("sequelize");

// creating chat model
const Chat = sequelize.define("Chat", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Chat;
