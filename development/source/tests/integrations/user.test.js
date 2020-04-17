const request = require('supertest')
const HttpStatusCodes = require('http-status-codes')
const randomString = require('random-string')

const app = require('../../app')
const v1Models = require('../../models/v1')
const jwtUtil = require('../../utils/jwt')
const bcrypt = require('bcrypt')

let nickname
let password
let token

beforeAll(async () => {
  nickname = randomString()
  password = randomString()
})

afterAll(() => v1Models.sequelize.close())

describe('POST /users', () => {
  test('create user', async () => {
    let res = await request(app)
      .post('/v1/users')
      .send({
        nickname,
        password
      })

    const isMatch = await bcrypt.compare(password, res.body.data.password)

    expect(res.statusCode).toBe(HttpStatusCodes.CREATED)
    expect(res.body.data.nickname).toBe(nickname)
    expect(isMatch).toBe(true)

    token = jwtUtil.generate({ id: res.body.data.id, nickname: nickname })
  })

  test('create user but already exists nickname', async () => {
    let res = await request(app)
      .post('/v1/users')
      .send({
        nickname,
        password
      })

    expect(res.statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
  })
})

describe('GET /users', () => {
  test('Get user loaded with profile.', async () => {
    let res = await request(app)
      .get('/v1/users')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(HttpStatusCodes.OK)
  })
})

describe('PUT /users', () => {
  describe('PUT /', () => {
    test('password edit', async () => {
      let res = await request(app)
        .put('/v1/users')
        .send({
          password: 'asdf'
        })
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(HttpStatusCodes.OK)
    })
  })

  describe('PUT /profiles', () => {
    test('profile edit', async () => {
      let res = await request(app)
        .put('/v1/users/profiles')
        .send({
          profileImg: '/asdf',
          greeting: 'asdf'
        })
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(HttpStatusCodes.OK)
    })
  })
})

describe('DELETE /users', () => {
  describe('DELETE /profiles', () => {
    test('reset user profile', async () => {
      let res = await request(app)
        .delete('/v1/users/profiles')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(HttpStatusCodes.OK)
      expect(res.body.data.profile.profileImg).toBe(null)
      expect(res.body.data.profile.greeting).toBe(null)
    })
  })

  describe('DELETE /', () => {
    test('delete user', async () => {
      let res = await request(app)
        .delete('/v1/users')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(HttpStatusCodes.OK)
    })
  })
})