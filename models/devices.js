'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Devices extends Model {
        static associate(models) {
            Devices.belongsTo(models.User, {
                foreignKey: "userId",
                onDelete: "CASCADE"
            });
        }
    };
    Devices.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        plateform: {
            type: DataTypes.STRING,
            allowNull: false
        },
        device_token: {
            type: DataTypes.STRING,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'Devices',
    });
    return Devices;
};