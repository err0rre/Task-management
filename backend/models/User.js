//models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // 数据库实例

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }

});

module.exports = User;
