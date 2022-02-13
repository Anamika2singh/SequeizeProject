'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class HidePosts extends Model {
        static associate(models) {
            HidePosts.belongsTo(models.User, {
                foreignKey: "hide_by",
                onDelete: "CASCADE",
                as: 'user'
            });
        }
    };
    HidePosts.init({
        hide_by: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        hide_user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        message: {
            type: DataTypes.STRING,
            allowNull: true

        }
    }, {
        sequelize,
        modelName: 'HidePosts',
    });
    return HidePosts;
};