'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'nickHash', {
      allowNull: false,
      unique: true,
      type: 'BINARY(16)',
      after: 'nickname'
    })

    await queryInterface.removeIndex('users', 'nickname')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'nickHash')
  }
}
