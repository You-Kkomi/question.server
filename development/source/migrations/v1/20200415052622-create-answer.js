'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('answers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      questionId: {
        allowNull: false,
        references: {
          model: 'questions',
          key: 'id'
        },
        type: Sequelize.INTEGER.UNSIGNED,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      userId: {
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        type: Sequelize.INTEGER.UNSIGNED,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      content: {
        allowNull: false,
        type: Sequelize.STRING
      },
      parentId: {
        allowNull: false,
        type: Sequelize.INTEGER.UNSIGNED
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('answers')
  }
}