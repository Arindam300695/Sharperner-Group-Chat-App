const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRouter = require("./routes/authRouter");
const sequelize = require("./database/dbConnection");
require("dotenv").config();

// ...

const startApp = async () => {
    try {
        await sequelize.sync({}); // Synchronize models with the database
        console.log("Database synchronized successfully");

        // Rest of your application code
    } catch (error) {
        console.error("Unable to synchronize the database:", error);
    }
};

const app = express();

// injecting express middleware
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

// routes
// authentication route
app.use("/auth", authRouter);

// listening to the port
app.listen(process.env.PORT || 8080, (err) => {
    if (!err) {
        console.log(`server listening on ${process.env.PORT || 8080}`);
        startApp();
    } else {
        console.log(err.messgae);
    }
});
