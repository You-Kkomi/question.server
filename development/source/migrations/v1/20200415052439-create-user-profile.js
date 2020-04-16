'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      userId: {
        references: {
          model: 'users',
          key: 'id'
        },
        unique: true,
        type: Sequelize.INTEGER.UNSIGNED,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      profileImg: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      greeting: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_profiles')
  }
}