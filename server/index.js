const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRouter = require("./routes/authRouter");
const sequelize = require("./database/dbConnection");
const chatRouter = require("./routes/chatRouter");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const startApp = async () => {
    try {
        await sequelize.sync(); // Synchronize models with the database
        console.log("Database synchronized successfully");

        // Rest of your application code
    } catch (error) {
        console.error("Unable to synchronize the database:", error.messgae);
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
// chat routes
app.use("/chat", chatRouter);

// listening to the port
app.listen(process.env.PORT || 8080, (err) => {
    if (!err) {
        console.log(`server listening on ${process.env.PORT || 8080}`);
        startApp();
    } else {
        console.log(err.messgae);
    }
});
