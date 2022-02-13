'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasOne(models.Devices, {
                foreignKey: "userId",
                onDelete: "CASCADE"
            });
            User.hasMany(models.Photos, {
                foreignKey: "userId",
                onDelete: "CASCADE"
            });
            User.hasMany(models.HidePosts, {
                foreignKey: "hide_by",
                onDelete: "CASCADE",
                as:"hides"

            });
            User.hasOne(models.BasicInfo, {
                foreignKey: "userId",
                onDelete: "CASCADE"
            });
            User.hasMany(models.LikesDislikes, {
                foreignKey: "action_user_id",
                onDelete: "CASCADE"
            });
            User.hasMany(models.Interests, {
                foreignKey: "userId",
                onDelete: "CASCADE"
            });
            // User.hasMany(models.LikesDislikes, {
            //     foreignKey: "opponent_user_id",
            //     onDelete: "CASCADE"
            // });


        }
    };
    User.init({
        mobile_number: {
            type: DataTypes.BIGINT,
            allowNull: true,
            defaultValue: 0
        },
        signup_type: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        instagram_id: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 0
        },
        country_code: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        profile_created: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        },
        otp_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        }


    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};