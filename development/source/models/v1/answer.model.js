module.exports = (sequelize, DataTypes) => {

  const Answer = sequelize.define(
    'Answer',
    {
      questionId: {
        reference: {
          model: 'questions',
          key: 'id'
        },
        type: DataTypes.INTEGER.UNSIGNED
        
      },
      userId: {
        reference: {
          model: 'users',
          key: 'id'
        },
        type: DataTypes.INTEGER.UNSIGNED
      },
      content: {
        allowNull: false,
        type: DataTypes.STRING
      }
    }, {
      tableName: 'answers',
      timestamps: true
    })

  Answer.associate = (models) => {
    Answer.belongsTo(models.Question, {
      as: 'questions',
      foreignKey: 'questionId'
    })

    Answer.belongsTo(models.Question, {
      as: 'users',
      foreignKey: 'userId'
    })
  }

  return Answer

}
