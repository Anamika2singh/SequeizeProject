'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Photos extends Model {
        static associate(models) {
            Photos.belongsTo(models.User, {
                foreignKey: "userId",
                onDelete: "CASCADE"
            });
            // Photos.belongsTo(models.BasicInfo, {
            //     foreignKey: "userId",
            //     onDelete: "CASCADE"
            // });
        }
    };
    Photos.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        image_name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Photos',
    });
    return Photos;
};