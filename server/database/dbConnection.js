const { Sequelize } = require("sequelize");
require("dotenv").config();

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize(
    process.env.db_name,
    process.env.db_username,
    process.env.db_password,
    {
        host: process.env.db_host,
        dialect:
            "mysql" /* one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */,
    }
);

module.exports = sequelize;
