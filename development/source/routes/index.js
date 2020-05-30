const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  return res.json({ message: 'pong' })
})

router.get('/debug-sentry', () => {
  throw new Error('Exception on debug sentry')
})

router.use('/v1', require('./v1'))

module.exports = router
