const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Comment = sequelize.define('Comment', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    schema: 'tech_blog_schema',
    tableName: 'Comments',
  });

  Comment.associate = (models) => {
    // Define associations here
  };

  return Comment;
};
