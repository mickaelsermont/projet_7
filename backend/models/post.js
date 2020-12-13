'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    text: DataTypes.TEXT,
    mediaUrl: DataTypes.STRING,
    countLikes: DataTypes.INTEGER,
    userID: DataTypes.INTEGER
  }, {});
  Post.associate = function(models) {
    // associations can be defined here
    models.Post.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
        onDelete: 'CASCADE'
      }
    });

    models.Post.hasMany(models.Comment, { onDelete: 'CASCADE' });
    models.Post.hasMany(models.Like, { onDelete: 'CASCADE' });
  };
  return Post;
};