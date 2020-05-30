const express = require('express')
const router = express.Router()

const controller = require('../../controllers/v1/auth.controller')
const validation = require('../../validations/v1/user.validation')
const validator = require('express-joi-validation').createValidator({ passError: true })
const middleware = require('../../middlewares/v1/auth.middleware')

router.route('/login')
  .post(
    validator.body(validation.create),
    controller.login
  )

router.route('/logout')
  .delete(
    middleware.check,
    controller.logout
  )

module.exports = router
