const express = require("express");
const { getChatController } = require("../controller/chatController");
const chatRouter = express.Router();

chatRouter.get("/getChats", getChatController);

module.exports = chatRouter;
