const HttpStatusCodes = require('http-status-codes')
const sequelize = require('sequelize')

const response = require('../../utils/response')
const v1Models = require('../../models/v1')
const Op = sequelize.Op

module.exports.get = async(req, res, next) => {
  try {
    const where = {}

    if (req.query.title) {
      where.title = {
        [ Op.like ]: `%${req.query.title}%`
      }
    }

    const questions = await v1Models.Question.findAll({
      include: [
        {
          model: v1Models.Answer,
          as: 'answers'
        }
      ],
      where,
      order: [
        [
          'id',
          'DESC'
        ]
      ]
    })

    return response(res, '질문을 가져왔습니다.', { questions })
  } catch (err) {
    next(err)
  }
}

module.exports.getOne = async(req, res, next) => {
  try {
    return response(res, '질문을 조회하였습니다.', { question: req.question })
  } catch (err) {
    next(err)
  }
}

module.exports.create = async(req, res, next) => {
  try {
    const question = await v1Models.Question.create({
      userId: req.user.id,
      title: req.body.title,
      content: req.body.content
    })

    return response(res, '질문이 등록되었습니다.', { question }, HttpStatusCodes.CREATED)
  } catch (err) {
    next(err)
  }
}

module.exports.update = async(req, res, next) => {
  try {
    await v1Models.Question.update({
      title: req.body.title,
      content: req.body.content
    }, {
      where: {
        id: req.params.id
      }
    })

    return response(res, '질문이 수정되었습니다.')
  } catch (err) {
    next(err)
  }
}

module.exports.delete = async(req, res, next) => {
  try {
    await v1Models.Question.destroy({
      where: {
        id: req.params.id
      }
    })

    return response(res, '질문이 삭제되었습니다.')
  } catch (err) {
    next(err)
  }
}

module.exports.createAnswer = async(req, res, next) => {
  try {
    const answerData = {
      questionId: req.question.id,
      userId: req.user.id,
      content: req.body.content
    }

    if (req.body.parentId) {
      answerData.parentId = req.body.parentId
    }

    const answer = await v1Models.Answer.create(answerData)

    return response(res, '답변이 등록되었습니다.', { answer }, HttpStatusCodes.CREATED)
  } catch (err) {
    next(err)
  }
}

module.exports.updateAnswer = async(req, res, next) => {
  try {
    await v1Models.Answer.update({
      content: req.body.content
    }, {
      where: {
        id: req.params.answerId
      }
    })

    return response(res, '답변이 수정되었습니다.')
  } catch (err) {
    next(err)
  }
}

module.exports.deleteAnswer = async(req, res, next) => {
  try {
    await v1Models.Answer.destroy({
      where: {
        id: req.params.answerId
      }
    })

    return response(res, '답변이 삭제되었습니다.')
  } catch (err) {
    next(err)
  }
}
