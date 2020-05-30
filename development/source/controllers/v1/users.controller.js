const bcrypt = require('bcrypt')

const HttpStatusCodes = require('http-status-codes')
const crypto = require('../../utils/crypto')
const v1Models = require('../../models/v1')
const userRepo = require('../../repos/v1/users.repo')
const response = require('../../utils/response')

module.exports.get = async(req, res, next) => {
  try {
    if (req.params.id) {
      return response(res, '', { user: await userRepo.load(req.params.id) })
    }

    return response(res, '', { user: req.user })
  } catch (err) {
    next(err)
  }
}

module.exports.create = async(req, res, next) => {
  try {
    let user = await v1Models.User.findOne({
      where: {
        nickHash: Buffer.from(crypto.md5(req.body.nickname), 'hex')
      }
    })

    if (user) {
      return response(res, '이미 존재하는 계정입니다.', {}, HttpStatusCodes.BAD_REQUEST)
    }

    user = await v1Models.User.create(req.body)

    return response(res, '사용자를 생성했습니다.', user, HttpStatusCodes.CREATED)
  } catch (err) {
    next(err)
  }
}

module.exports.update = async(req, res) => {
  const salt = await bcrypt.genSalt(10)
  const password = await bcrypt.hash(req.body.password, salt)

  await v1Models.User.update({
    password
  }, {
    where: {
      id: req.user.id
    }
  })

  return response(res, '비밀번호를 수정했습니다.')
}

module.exports.destroy = async(req, res) => {
  await v1Models.User.destroy({
    where: {
      id: req.user.id
    }
  })

  return response(res, '사용자를 삭제했습니다.')
}

module.exports.updateProfile = async(req, res, next) => {
  try {
    let profile = req.user.profile

    await profile.update(req.body)

    return response(res, '프로필을 수정했습니다.', { profile })
  } catch (err) {
    next(err)
  }
}

module.exports.clearProfile = async(req, res, next) => {
  try {
    const profile = req.user.profile

    profile.profileImg = null
    profile.greeting = null

    await profile.save()

    return response(res, '프로필을 초기화 했습니다.', { profile })
  } catch (err) {
    next(err)
  }
}
