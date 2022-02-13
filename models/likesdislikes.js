'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class LikesDislikes extends Model {
        static associate(models) {
            LikesDislikes.belongsTo(models.User, {
                foreignKey: "action_user_id",
                onDelete: "CASCADE"
            });
            // LikesDislikes.belongsTo(models.User, {
            //     foreignKey: "opponent_user_id",
            //     onDelete: "CASCADE"
            // });

        }
    };
    LikesDislikes.init({
        action_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        opponent_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status:{
            type: DataTypes.INTEGER,
            defaultValue:0
        }
    }, {
        sequelize,
        modelName: 'LikesDislikes',
    });
    return LikesDislikes;
};