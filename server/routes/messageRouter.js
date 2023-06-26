const express = require("express");
const {
    getUsersController,
    createMessageController,
    getMessageController,
} = require("../controller/messageController");
const messageRouter = express.Router();

// for users
messageRouter.get("/getUsers", getUsersController);
// for messages
messageRouter.post("/createMessage", createMessageController);
messageRouter.get("/getMessages/:groupId", getMessageController);

module.exports = messageRouter;
