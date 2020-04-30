'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'answers',
      'parentId'
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'answers',
      'parentId',
      Sequelize.INTEGER.UNSIGNED
    )
  }
}
