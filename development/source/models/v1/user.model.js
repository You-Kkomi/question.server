'use strict'

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      nickname: {
        allownull: false,
        type: DataTypes.STRING(20)
      },
      password: {
        allownull: false,
        type: DataTypes.STRING
      }
    },
    {
    tableName: 'users',
    timestamps: true
  })

  User.associate = (models) => {
    User.hasOne(models.UserProfiel, {
      as: 'profile',
      foreignKey: 'userId'
    })

    User.hasMany(models.Question, {
      as: 'question',
      foreignKey: 'userId'
    })
  }

  User.afterCreate(async (user) => {
    try {
      await sequelize.models.UserProfile.create({
        userId: user.id
      })
    } catch (err) {
      throw err
    }
  })

  return User
}