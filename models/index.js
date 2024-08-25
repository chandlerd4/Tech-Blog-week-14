const sequelize = require('../config/database');

const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

const models = {
  User: User.init(sequelize),
  Post: Post.init(sequelize),
  Comment: Comment.init(sequelize),
};

// Define associations
User.associate(models);
Post.associate(models);
Comment.associate(models);

module.exports = {
  sequelize,
  ...models,
};