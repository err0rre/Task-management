//backend/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create a Sequelize instance and connect to the PostgreSQL database
// Replace 'task_manager' with the name of the database you created, 'tailor' and 'password' are your database username and password.
const sequelize = new Sequelize(
  process.env.DB_NAME,       // 数据库名称
  process.env.DB_USER,       // 数据库用户名
  process.env.DB_PASSWORD,   // 数据库密码
  {
    host: process.env.DB_HOST,  // 数据库主机，在 docker-compose 中是 "db"
    dialect: 'postgres',
    port: process.env.DB_PORT,   // 数据库端口
    logging: console.log
  }
);

// Test the database connection to ensure Sequelize can connect to PostgreSQL successfully
sequelize.authenticate()
  .then(() => {
    console.log('Connection to PostgreSQL has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
