const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');  // Import the User model

// Define the Task model
const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,  // Title cannot be empty
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',  // Default status is 'pending'
  },
  priority: {
    type: DataTypes.INTEGER,  // Priority: 1=High, 2=Medium, 3=Low
    allowNull: true,  // Can be null
  },
  dueDate: {
    type: DataTypes.DATE,  // Due date
    allowNull: true,  // Can be null
  },
}, {
  timestamps: true,  // Enable Sequelize automatic timestamps (createdAt, updatedAt)
});

// Define relationship: Task belongs to a User
Task.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Task, { foreignKey: 'userId' });

// Sync the database table structure
Task.sync({ alter: true })  // Use alter mode to update the table structure without recreating it
  .then(() => {
    console.log('Task table updated successfully.');
  })
  .catch((err) => {
    console.error('Error updating Task table:', err);
  });

module.exports = Task;

