const HttpStatusCodes = require('http-status-codes')

const response = require('../../utils/response')
const v1Models = require('../../models/v1')
const jwt = require('../../utils/jwt')

module.exports.login = async (req, res, next) => {
  try {
    const id = req.body.id
    const password = req.body.password

    const user = await v1Models.User.findOne({
      where: {
        nickname: req.body.nickname
      }
    })

    if (!user) {
      return response(res, '사용자를 찾을 수 없습니다.', {}, HttpStatusCodes.NOT_FOUND)
    }

    if (await user.checkPassword(password)) {
      const token = jwt.generate({ id: user.id, nickname: user.nickname })

      return response(res, '로그인에 성공하였습니다.', { token }, HttpStatusCodes.OK)
    }

    return response(res, '패스워드가 일치하지 않습니다.', {}, HttpStatusCodes.NOT_FOUND)
  } catch (err) {
    next(err)
  }
}

module.exports.logout = async (req, res, next) => {
  try {

    return response(res, '로그아웃 하였습니다.')
  } catch (err) {
    throw err
  }
}