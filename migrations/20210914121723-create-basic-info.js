'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('BasicInfos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER
      },
      gender: {
        type: Sequelize.STRING
      },
      origin_location: {
        type: Sequelize.STRING
      },
      current_location: {
        type: Sequelize.STRING
      },
      height: {
        type: Sequelize.STRING
      },
      education: {
        type: Sequelize.STRING
      },
      drinking_status: {
        type: Sequelize.STRING
      },
      smoking_status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('BasicInfos');
  }
};