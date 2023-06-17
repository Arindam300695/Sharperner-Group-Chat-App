const express = require("express");
const { getUsersController } = require("../controller/chatController");
const chatRouter = express.Router();

chatRouter.get("/getUsers", getUsersController);

module.exports = chatRouter;
