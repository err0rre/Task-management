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
}, {
  timestamps: true,  // 启用 Sequelize 自动时间戳 (createdAt, updatedAt)
});

// 强制同步数据库表（如果需要重建表，可以设置 force: true）
Task.sync({ force: false })  // 确保此处设置 force: false，避免重建表
  .then(() => {
    console.log('Task table created successfully.');
  })
  .catch((err) => {
    console.error('Error creating table:', err);
  });

// 任务属于一个用户
Task.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Task, { foreignKey: 'user_id' });


module.exports = Task;
