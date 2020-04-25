'use strict'

const Joi = require('@hapi/joi')

module.exports.createQuestion = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required()
})

module.exports.createAnswer = Joi.object({
    content: Joi.string().required()
})

module.exports.questionId = Joi.object({
    id: Joi.number().required()
})