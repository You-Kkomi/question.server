'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../../controllers/v1/auth.controller')
const validation = require('../../validations/v1/user.validation')
const validator = require('express-joi-validation').createValidator({ passError: true })

router.route('/login')
  .post(
    validator.body(validation.create),
    controller.login
  )

router.route('/logout')
  .post(controller.logout)

module.exports = router