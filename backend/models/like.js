'use strict';
module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define('Like', {
        userID: DataTypes.INTEGER,
        postID: DataTypes.INTEGER
    }, {});

    Like.associate = function(models) {
        // associations can be defined here
        models.Like.belongsTo(models.User, {
        foreignKey: {
            allowNull: true,
            onDelete: 'CASCADE'
        }
        });

        models.Like.belongsTo(models.Post, {
        foreignKey: {
            allowNull: true,
            onDelete: 'CASCADE'
        }
        });
    };
    return Like;
};