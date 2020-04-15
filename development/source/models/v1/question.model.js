'use strict'

module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define(
    'Question',
    {
      userId: {
        references: {
          model: 'users',
          key: 'id'
        },
        type: DataTypes.INTEGER.UNSIGNED
      },
      title: {
        allowNulls: false,
        type: DataTypes.STRING
      },
      content: {
        allowNulls: false,
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'questions',
      timestamps: true
    }
  )

  Question.associate = (models) => {
    Question.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId'
    })

    Question.hasMany(models.Answer, {
      as: 'answer',
      foreignKey: 'id'
    })
  }
  return Question
}