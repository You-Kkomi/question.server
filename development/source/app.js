'use strict'

require('dotenv').config()

const createError = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const HttpStatusCode = require('http-status-codes')

const Sentry = require('@sentry/node')

const app = express()

Sentry.init({ dsn: 'https://af99866f568946c08b868cabb6a20370@o386614.ingest.sentry.io/5221132' })

app.use(cors())
app.use(helmet())
app.use(logger('combined'))
app.use(express.json())
app.use(express.urlencoded({
  extended: false
}))
app.use(cookieParser())

app.use(Sentry.Handlers.requestHandler())

app.use('/', require('./routes'))

app.use(Sentry.Handlers.errorHandler())

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