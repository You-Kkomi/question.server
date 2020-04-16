'use strict'

const _ = require('lodash')
const HttpStatusCodes = require('http-status-codes')
const v1Models = require('../../models/v1')
const response = require('../../utils/response')

module.exports.get = async (req, res, next) => {
  try {
    return response(res, '', { user: req.user })
  } catch (err) {
    next(err)
  }
}

module.exports.create = async (req, res, next) => {
  try {
    var user = await v1Models.User.findOne({
      where: {
        nickname: req.body.nickname
      }
    })
    
    if (user) {
      return response(res, '이미 존재하는 계정입니다.', {}, HttpStatusCodes.NOT_FOUND)
    }

    user = await v1Models.User.create(req.body)

    return response(res, '사용자를 생성했습니다.', user, HttpStatusCodes.CREATED)
  } catch (err) {
    next(err)
  }
}

module.exports.update = (req, res, next) => {
  if (req.body.password) {
    // single action 업데이트
    v1Models.User.update({
      password: req.body.password
    }, {
      where: {
        id: req.params.id
      }
    }).catch(err => { throw (err) })
  }

  return response(res, '비밀번호를 수정했습니다.')
}

module.exports.destroy = (req, res, next) => {
  v1Models.User.destroy({
    where: {
      id: req.params.id
    }
  }).catch(err => { throw (err) })

  return response(res, '사용자를 삭제했습니다.')
}

module.exports.updateProfile = async (req, res, next) => {
  try {
    var profile = req.user.profile

    await v1Models.UserProfile.update(
      req.body,
      {
        where: {
          id: profile.id
        }
      }
    )

    return response(res, '프로필을 수정했습니다.')
  } catch (err) {
    throw err
    next(err)
  }
}

module.exports.clearProfile = async (req, res, next) => {
  try {
    const profile = req.user.profile

    await v1Models.UserProfile.destroy(
      {
        where: {
          id: profile.id
        }
      }
    )

    return response(res, '프로필을 초기화 했습니다.')
  } catch (err) {
    throw err
    next(err)
  }
}