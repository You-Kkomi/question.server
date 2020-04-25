'use strict'
const HttpStatusCodes = require('http-status-codes')

const response = require('../../utils/response')
const v1Models = require('../../models/v1')


module.exports.checkQuestionExist = async (req, res, next) => {
  try {
    const question = await v1Models.Question.findByPk(req.params.id, {
      include: [
        {
          model: v1Models.Answer,
          as: 'answers'
        }
      ]
    })

    if (!question) {
      return response(res, '존재하지 않는 질문입니다.', {}, HttpStatusCodes.NOT_FOUND)
    }

    req.question = question

    next()
  } catch (err) {
    next(err)
  }
}

module.exports.checkQuestionOwner = async (req, res, next) => {
  try {
    if (req.question.userId != req.user.id) {
      return response(res, '질문의 작성자가 아닙니다.', {}, HttpStatusCodes.FORBIDDEN)
    }
    next()
  } catch (err) {
    next(err)
  }
}

module.exports.checkAnswerExist = async (req, res, next) => {
  try {
    const answer = await v1Models.Answer.findByPk(req.params.answerId)

    if (!answer) {
      return response(res, '존재하지 않는 답변 입니다.', {}, HttpStatusCodes.NOT_FOUND)
    }

    req.answer = answer

    next()
  } catch (err) {
    next(err)
  }
}

module.exports.checkAnswerOwner = async (req, res, next) => {
  try {
    if (req.answer.userId != req.user.id) {
      return response(res, '답변의 작성자가 아닙니다.', {}, HttpStatusCodes.FORBIDDEN)
    }
    next()
  } catch (err) {
    next(err)
  }
}