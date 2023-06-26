const express = require("express");
const {
    createGroupController,
    fetchGroupController,
    addMemberstoGroupController,
    getCompleteGroupDetailsController,
} = require("../controller/groupController");
const groupRouter = express.Router();

groupRouter.post("/createGroup", createGroupController);
groupRouter.post("/addMembersToGroup", addMemberstoGroupController);
groupRouter.get("/getGroup", fetchGroupController);
groupRouter.post(
    "/getCompleteGroupDetails/:groupId",
    getCompleteGroupDetailsController
);

module.exports = groupRouter;
