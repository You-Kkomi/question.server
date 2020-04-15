const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.json({ message: 'v1 pong' })
})

router.use('/auth', require('./auth.route'))

module.exports = router