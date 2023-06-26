const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRouter = require("./routes/authRouter");
const sequelize = require("./database/dbConnection");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const User = require("./models/userModel");
const Group = require("./models/groupModel");
const Message = require("./models/messageModel");
const groupRouter = require("./routes/groupRouter");
const messageRouter = require("./routes/messageRouter");

const startApp = async () => {
    try {
        await sequelize.sync({}); // Synchronize models with the database
        console.log("Database synchronized successfully");

        // Rest of your application code
    } catch (error) {
        console.error("Unable to synchronize the database:", error.message);
    }
};

const app = express();

// injecting express middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
// authentication route
app.use("/auth", authRouter);
// message routes
app.use("/message", messageRouter);
// group routes
app.use("/group", groupRouter);

// defining relations between User and Message models
Message.belongsTo(User);
// defining relations between Message and Group models
Message.belongsTo(Group);
// defining relations between User and Group models
Group.belongsTo(User);

// listening to the port
app.listen(process.env.PORT || 8080, (err) => {
    if (!err) {
        console.log(`server listening on ${process.env.PORT || 8080}`);
        startApp();
    } else {
        console.log(err.messgae);
    }
});
