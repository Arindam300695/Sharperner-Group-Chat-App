const express = require("express");
const {
    getUsersController,
    createMessageController,
    getMessageController,
} = require("../controller/chatController");
const chatRouter = express.Router();

chatRouter.get("/getUsers", getUsersController);
chatRouter.post("/createMessage", createMessageController);
chatRouter.get("/getMessages", getMessageController);

module.exports = chatRouter;
