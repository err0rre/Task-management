//models/Task.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

// 定义任务模型
const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  priority: {
    type: DataTypes.INTEGER,  // 1高, 2中, 3低
    allowNull: true, 
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  userId: {  // 外键
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true,  // 启用 Sequelize 自动时间戳 (createdAt, updatedAt)
});

// 建立 Task 和 User 之间的关联
Task.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Task, { foreignKey: 'userId' });

module.exports = Task;
