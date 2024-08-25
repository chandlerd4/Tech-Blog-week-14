const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Session = sequelize.define('Session', {
    sid: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    expires: DataTypes.DATE,
    data: DataTypes.TEXT,
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  }, {
    schema: 'tech_blog_schema', // Optional: specify schema if needed
    tableName: 'Sessions',
  });

  return Session;
};
