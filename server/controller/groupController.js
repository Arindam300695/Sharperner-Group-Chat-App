const Group = require("../models/groupModel");
const jwt = require("jsonwebtoken");
const UserGroup = require("../models/userGroupModel");
const User = require("../models/userModel");

//. creating groups controller
const createGroupController = async (req, res) => {
    const { groupName } = req.body;
    // receiving the jwt token from the admin and checking if the token is valid or not which we will recieve from request cookies
    const { jwt_token } = req.cookies;
    try {
        // checking if the user is sending the token while trying to access this route or not
        if (!jwt_token) {
            return res.json({ error: "Access Denied" });
        }
        // but if the user is sending the token while trying to access this route
        // verifying the token using jwt library
        const decoded = jwt.verify(jwt_token, process.env.JWT_SECRET);
        if (!decoded) return res.json({ error: "Invalid token" });
        // if (decoded) then creating a new group and saving it to the database
        if (await Group.findOne({ where: { groupName } }))
            return res.json({
                error: "Group already exists with the same name",
            });
        const group = new Group({ groupName, ChatUserId: decoded.id });
        await group.save();
        await UserGroup.create({ userId: decoded.id, groupId: group.id });
        return res.json({ message: "Group created successfully", group });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

// adding members to group
const addMemberstoGroupController = async (req, res) => {
    const { groupId, userList } = req.body;
    // receiving the jwt token from the admin and checking if the token is valid or not which we will recieve from request cookies
    const { jwt_token } = req.cookies;
    try {
        // checking if the user is sending the token while trying to access this route or not
        if (!jwt_token) {
            return res.json({ error: "Access Denied" });
        }
        // but if the user is sending the token while trying to access this route
        // verifying the token using jwt library
        const decoded = jwt.verify(jwt_token, process.env.JWT_SECRET);
        if (!decoded) return res.json({ error: "Invalid token" });
        // if (decoded) then adding the users from the userlist receiving from req.body to the group
        for (let i = 0; i < userList.length; i++) {
            await UserGroup.create({ userId: userList[i], groupId });
        }
        return res.send({ message: "added to group successfully" });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

// fetching user specific groups from the database
const fetchGroupController = async (req, res) => {
    // receiving the jwt token from the admin and checking if the token is valid or not which we will recieve from request cookies
    const { jwt_token } = req.cookies;
    try {
        // checking if the user is sending the token while trying to access this route or not
        if (!jwt_token) {
            return res.json({ error: "Access Denied" });
        }
        // but if the user is sending the token while trying to access this route
        // verifying the token using jwt library
        const decoded = jwt.verify(jwt_token, process.env.JWT_SECRET);
        if (!decoded) return res.json({ error: "Invalid token" });
        // if (decoded) then fetching all the group details based on the user id of which is stroed in this jwt_token
        const groups = await UserGroup.findAll({
            where: { userId: decoded.id },
        });
        let groupCollection = [];
        for (let i = 0; i < groups.length; i++) {
            const eachGroup = await Group.findByPk(groups[i].groupId);
            groupCollection.push({
                groupName: eachGroup.groupName,
                id: eachGroup.id,
                admin: eachGroup.ChatUserId,
            });
        }
        return res.json(groupCollection);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

const getCompleteGroupDetailsController = async (req, res) => {
    const { groupId } = req.params;
    const { userData } = req.body;
    const temp = []; // list of all the users that is supposed to be added in the group based on the conditions provided
    const myData2 = []; // list of userIds that is already present in the current group
    const myData1 = []; // list of userIds that is not present in the current group
    const usersToBeAdded = []; // list of users to be added in the current group
    // receiving the jwt token from the admin and checking if the token is valid or not which we will recieve from request cookies
    const { jwt_token } = req.cookies;
    try {
        // checking if the user is sending the token while trying to access this route or not
        if (!jwt_token) {
            return res.json({ error: "Access Denied" });
        }
        // but if the user is sending the token while trying to access this route
        // verifying the token using jwt library
        const decoded = jwt.verify(jwt_token, process.env.JWT_SECRET);
        if (!decoded) return res.json({ error: "Invalid token" });
        // but if decoded
        userData.forEach((element) => {
            temp.push(element.id);
        });
        const groupDetails = await UserGroup.findAll({ where: { groupId } });
        groupDetails.forEach((element) => {
            myData2.push(element.userId);
        });
        for (let i = 0; i < temp.length; i++) {
            if (!myData2.includes(temp[i])) {
                myData1.push(temp[i]);
            }
        }
        for (let i = 0; i < myData1.length; i++) {
            const user = await User.findOne({ where: { id: myData1[i] } });
            usersToBeAdded.push({ name: user.name, id: user.id });
        }
        res.json(usersToBeAdded);
    } catch (error) {
        return res.json({ error: error.message });
    }
};

module.exports = {
    createGroupController,
    fetchGroupController,
    addMemberstoGroupController,
    getCompleteGroupDetailsController,
};
