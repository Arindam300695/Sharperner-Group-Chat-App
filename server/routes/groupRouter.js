const express = require("express");
const {
    createGroupController,
    fetchGroupController,
    addMemberstoGroupController,
    getCompleteGroupDetailsController,
    findMemebrsforRemovingController,
    removeMemberfromGroupController,
} = require("../controller/groupController");
const groupRouter = express.Router();

groupRouter.post("/createGroup", createGroupController);
groupRouter.post("/addMembersToGroup", addMemberstoGroupController);
groupRouter.get("/getGroup", fetchGroupController);
groupRouter.post(
    "/getCompleteGroupDetails/:groupId",
    getCompleteGroupDetailsController
);
groupRouter.get("/removeMember/:groupId", findMemebrsforRemovingController);
groupRouter.delete(
    "/removeMemberfromGroup/:groupId/:userId",
    removeMemberfromGroupController
);

module.exports = groupRouter;
