const crypto = require('crypto')

module.exports.md5 = (text) => {
  if (!text) {
    return null
  }

  return crypto.createHash('md5')
    .update(text)
    .digest('hex')
}
