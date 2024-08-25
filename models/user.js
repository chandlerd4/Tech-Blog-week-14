const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  schema: 'tech_blog_schema', // Optional: specify schema if needed
  tableName: 'Users', // Optional: specify table name if needed
});

module.exports = User;
