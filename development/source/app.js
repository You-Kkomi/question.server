'use strict'

require('dotenv').config()

const createError = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const HttpStatusCode = require('http-status-codes')

const app = express()

app.use(cors())
app.use(helmet())
app.use(logger('combined'))
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))
app.use(cookieParser())

app.use('/', require('./routes'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(HttpStatusCode.NOT_FOUND))
})

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {}

  if (err && err.error && err.error.isJoi) {
    return res.status(HttpStatusCode.UNPROCESSABLE_ENTITY).json({
      message: '잘못된 요청입니다.',
      data: err.error.toString()
    })
  }

  return res.status(err.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
    .json({
      err
    })
})

module.exports = app