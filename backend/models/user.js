'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
    bio: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    models.User.hasMany(models.Post, { onDelete: 'CASCADE' });
    models.User.hasMany(models.Comment, { onDelete: 'CASCADE' });
    models.User.hasMany(models.Like, { onDelete: 'CASCADE' });
  };
  return User;
};