'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    text: DataTypes.TEXT('medium'),
    userID: DataTypes.INTEGER,
    postID: DataTypes.INTEGER
  }, {});
  Comment.associate = function(models) {
    // associations can be defined here

    models.Comment.belongsTo(models.User, {
      foreignKey: {
        allowNull: true
      }
    });

    models.Comment.belongsTo(models.Post, {
      foreignKey: {
        allowNull: true
      }
    });
  };
  return Comment;
};