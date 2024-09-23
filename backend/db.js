const { Sequelize } = require('sequelize');

// 创建 Sequelize 实例并连接到 PostgreSQL 数据库!!!!!!将 'task_manager' 替换为你创建的数据库名称，'postgres' 和 'password' 分别是你的数据库用户名和密码。
const sequelize = new Sequelize('task_manager', 'tailor', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: console.log  // 确保 SQL 语句被输出到控制台
});

// 测试数据库连接,确保 Sequelize 能成功连接 PostgreSQL
sequelize.authenticate()
  .then(() => {
    console.log('Connection to PostgreSQL has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
