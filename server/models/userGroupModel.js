const sequelize = require("../database/dbConnection");
const { DataTypes } = require("sequelize");

const UserGroup = sequelize.define("userGroup", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = UserGroup;
