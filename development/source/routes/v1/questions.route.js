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
        question.questionCheck,
        controller.update
    )
    .delete(
        auth.check,
        question.questionCheck,
        controller.delete
    )

router.route('/:id/answers')
    .post(
        validator.body(validation.createAnswer),
        auth.check,
        controller.createAnswer
    )

router.route('/:id/answers/:answerId')
    .put(
        auth.check,
        question.answerCheck,
        controller.updateAnswer
    )
    .delete(
        auth.check,
        question.answerCheck,
        controller.deleteAnswer
    )

module.exports = router