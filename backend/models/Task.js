const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');  // 导入 User 模型

// 定义任务模型
const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,  // 标题不能为空
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',  // 默认为 'pending' 状态
  },
  priority: {
    type: DataTypes.INTEGER,  // 优先级，1=高, 2=中, 3=低
    allowNull: true,  // 可以为空
  },
  dueDate: {
    type: DataTypes.DATE,  // 截止日期
    allowNull: true,  // 可以为空
  },
}, {
  timestamps: true,  // 启用 Sequelize 自动时间戳 (createdAt, updatedAt)
});

// 设置关联关系：任务属于用户
Task.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Task, { foreignKey: 'userId' });

// 同步数据库表结构
Task.sync({ alter: true })  // 使用 alter 模式，不重建表，只修改表结构
  .then(() => {
    console.log('Task table updated successfully.');
  })
  .catch((err) => {
    console.error('Error updating Task table:', err);
  });

module.exports = Task;
