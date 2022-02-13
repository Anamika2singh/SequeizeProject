'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BasicInfo extends Model {
    static associate(models) {
      BasicInfo.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE"
      });


      //User.belongsToMany(Project, { through: UserProject });
    }
  };
  BasicInfo.init({
    userId: DataTypes.INTEGER,
    gender: DataTypes.STRING,
    origin_location: DataTypes.STRING,
    current_location: DataTypes.STRING,
    height: DataTypes.STRING,
    education: DataTypes.STRING,
    drinking_status: DataTypes.STRING,
    religion: DataTypes.STRING,
    smoking_status: DataTypes.STRING,
    dates_purpose:DataTypes.STRING,
    latitude:DataTypes.DOUBLE,
    bio:DataTypes.STRING,
    age:DataTypes.INTEGER,
    longitude:DataTypes.DOUBLE,
    name:DataTypes.STRING,
    exercise:DataTypes.STRING,
    snooze:{
      type:DataTypes.BOOLEAN,
      defaultValue:0
    }
  }, {
    sequelize,
    modelName: 'BasicInfo',
  });
  return BasicInfo;
};