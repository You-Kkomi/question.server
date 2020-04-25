const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.json({ message: 'v1 pong' })
})

router.use('/auth', require('./auth.route'))
router.use('/users', require('./users.route'))
router.use('/questions', require('./questions.route'))

module.exports = router