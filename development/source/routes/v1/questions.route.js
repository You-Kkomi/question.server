'use strict'

const validator = require('express-joi-validation').createValidator()
const express = require('express')
const router = express.Router()

const controller = require('../../controllers/v1/questions.controller')
const validation = require('../../validations/v1/question.validation')
const auth = require('../../middlewares/v1/auth.middleware')
const question = require('../../middlewares/v1/question.middleware')

router.route('/')
    .post(
        auth.check,
        validator.body(validation.createQuestion),
        controller.create
    )
    .get(
        auth.check,
        controller.get
    )

router.route('/:id')
    .put(
        auth.check,
        question.checkQuestionExist,
        question.checkQuestionOwner,
        controller.update
    )
    .delete(
        auth.check,
        question.checkQuestionExist,
        question.checkQuestionOwner,
        controller.delete
    )

router.route('/:id/answers')
    .post(
        validator.body(validation.createAnswer),
        auth.check,
        question.checkQuestionExist,
        controller.createAnswer
    )

router.route('/:id/answers/:answerId')
    .put(
        auth.check,
        question.checkAnswerExist,
        question.checkAnswerOwner,
        controller.updateAnswer
    )
    .delete(
        auth.check,
        question.checkAnswerExist,
        question.checkAnswerOwner,
        controller.deleteAnswer
    )

module.exports = router