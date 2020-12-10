'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    text: DataTypes.TEXT,
    mediaUrl: DataTypes.STRING,
    userID: DataTypes.INTEGER
  }, {});
  Post.associate = function(models) {
    // associations can be defined here
    models.Post.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });

    models.Post.hasMany(models.Comment);
    models.Post.hasMany(models.Like);
  };
  return Post;
};