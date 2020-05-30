module.exports = {
  async up(queryInterface) {
    await queryInterface.addColumn('users', 'nickHash', {
      allowNull: false,
      unique: true,
      type: 'BINARY(16)',
      after: 'nickname'
    })

    await queryInterface.removeIndex('users', 'nickname')
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'nickHash')
  }
}
