const { DataTypes } = require("sequelize");
const sequelize = require("../database/dbConnection"); // Import the sequelize instance

const User = sequelize.define("ChatUser", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = User;
