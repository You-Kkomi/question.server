const request = require('supertest')
const HttpStatusCodes = require('http-status-codes')
const randomString = require('random-string')

const app = require('../../app')
const v1Models = require('../../models/v1')
const jwtUtil = require('../../utils/jwt')

let user

let token

beforeAll(async() => {
  user = await v1Models.User.create({
    nickname: randomString(),
    password: randomString()
  })

  token = jwtUtil.generate({ id: user.id, nickname: user.nickname })
})

afterAll(() => v1Models.sequelize.close())

describe('auth middleware test', () => {
  test('request with token', async() => {
    let res = await request(app)
      .get('/v1/users')
      .set('Authorization', `Bearer ${ token }`)

    expect(res.statusCode).toBe(HttpStatusCodes.OK)
  })

  test('request without token', async() => {
    let res = await request(app)
      .get('/v1/users')

    expect(res.statusCode).toBe(HttpStatusCodes.FORBIDDEN)
  })

  test('request with invalide token', async() => {
    let res = await request(app)
      .get('/v1/users')
      .set('Authorization', 'Bearer aosdhialis')

    expect(res.statusCode).toBe(HttpStatusCodes.FORBIDDEN)
  })
})
