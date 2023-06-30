const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Op } = require("sequelize");
const Message = require("../models/messageModel");

// get users except than the one who is currently logged in
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
        // if (decoded) finding the user based on the id set on the token
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
        if (user.length === 0)
            return res.json({ message: "No user found", decoded });
        //  if the user is not empty
        return res.json({ user, decoded });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

// create messages and save them to the database
const createMessageController = async (req, res) => {
    // checking if the token is valid or not which we will recieve from request cookies
    const { jwt_token } = req.cookies;
    const { message, groupId, userId } = req.body;

    // checking if the user is sending the token while trying to access this route or not
    if (!jwt_token) {
        return res.json({ error: "Access Denied" });
    }
    try {
        // verifying the token using jwt library
        const decoded = jwt.verify(jwt_token, process.env.JWT_SECRET);
        if (!decoded) return res.json({ error: "Invalid token" });
        // if (decoded) need to create a new message and need to save it to the database
        const newMessage = await Message.create({
            message,
            ChatGroupId: groupId,
            ChatUserId: userId,
        });
        return res.json(newMessage);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

// getting messages from the database
const getMessageController = async (req, res) => {
    const { groupId } = req.params;

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
        // if (decoded) then need to find all the messages related that group in which user will click that are there in the database
        const messages = await Message.findAll({
            where: { ChatGroupId: groupId },
        });
        const users = [];
        for (let i = 0; i < messages.length; i++) {
            const user = await User.findOne({
                where: { id: messages[i].ChatUserId },
            });
            users.push({
                id: messages[i].id,
                message: messages[i].message,
                createdAt: messages[i].createdAt,
                ChatUserId: messages[i].ChatUserId,
                userName: user.name,
                userProfilePicture: user.profilePicture,
            });
        }
        return res.json(users);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

module.exports = {
    getUsersController,
    createMessageController,
    getMessageController,
};
