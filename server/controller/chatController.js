const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Op } = require("sequelize");

const getUsersController = async (req, res) => {
    // checking if the token is valid or not which we will recieve from request cookies
    const { jwt_token } = req.cookies;

    // checking if the user is sending the token while trying to access this route or not
    if (!jwt_token) {
        return res.json({ error: "Access Denied" });
    }
    // but if the user is sending the token while trying to access this route
    try {
        // verifying the token using jwt library
        const decoded = jwt.verify(jwt_token, process.env.JWT_SECRET);
        if (!decoded) return res.json({ error: "Invalid token" });
        // if (decoded finding the user based on the id set on the token
        const isExistingUser = await User.findOne({
            where: { id: decoded.id },
        });
        // if the user is not found
        if (!isExistingUser) {
            return res.json({ error: "Unauthorized User" });
        }
        // if the user is found then finding the current user's user
        const user = await User.findAll({
            where: { id: { [Op.ne]: decoded.id } },
        });
        // if the user is empty
        if (!user.length) return res.json({ error: "No user found" });
        //  if the user is not empty
        return res.json({ user, decoded });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

module.exports = { getUsersController };
