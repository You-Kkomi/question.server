'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('answers', 'parentId', {
      allowNull: true,
      type: Sequelize.INTEGER.UNSIGNED
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('answers', 'parentId', {
      allowNull: false,
      type: Sequelize.INTEGER.UNSIGNED
    })
  }
}
