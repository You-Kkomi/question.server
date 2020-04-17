'use strict'

const bcrypt = require('bcrypt')
const uuid4 = require('../../utils/uuid4')

const SALT_ROUND = 10

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      nickname: {
        allownull: false,
        unique: true,
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
    User.hasOne(models.UserProfile, {
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

  User.beforeSave(async (user) => {
    try {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(SALT_ROUND)
        user.password = await bcrypt.hash(user.password, salt)
      }
    } catch (err) {
      throw err
    }
  })

  User.prototype.checkPassword = async function (password) {
    try {
      const isMatch = await bcrypt.compare(password, this.getDataValue('password'))

      return isMatch
    } catch (err) {
      throw err
    }
  }

  return User
}