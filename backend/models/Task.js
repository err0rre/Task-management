const { DataTypes } = require('sequelize');
const sequelize = require('../db');

// 定义任务模型
const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// 强制同步数据库表（如果需要重建表，可以设置 force: true）
Task.sync({ force: false })  // 确保此处设置 force: false，避免重建表
  .then(() => {
    console.log('Task table created successfully.');
  })
  .catch((err) => {
    console.error('Error creating table:', err);
  });

module.exports = Task;
