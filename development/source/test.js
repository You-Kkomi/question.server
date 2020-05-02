const randomString = require('random-string')
const crypto = require('./utils/crypto')
const v1Models = require('./models/v1')

module.exports.test = async () => {
  let users = []
  for (let i = 0; i < 200000; i++) {
    let nickname = randomString() + i
    users.push({
      nickname,
      nickHash: Buffer.from(crypto.md5(nickname), 'hex'),
      password: '1234'
    })
  }

  await v1Models.User.bulkCreate(users)
}