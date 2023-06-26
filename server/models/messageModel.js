const sequelize = require("../database/dbConnection");
const { DataTypes } = require("sequelize");

// creating message model
const Message = sequelize.define("Message", {
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

module.exports = Message;
