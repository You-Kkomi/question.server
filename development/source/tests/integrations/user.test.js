const request = require('supertest')
const HttpStatusCodes = require('http-status-codes')
const randomString = require('random-string')

const app = require('../../app')
const v1Models = require('../../models/v1')
const jwtUtil = require('../../utils/jwt')

let user
let token

beforeAll(async () => {
  user = await v1Models.User.create({
    nickname: randomString(),
    password: randomString()
  })

  token = jwtUtil.generate({ id: user.id, nickname: user.nickname })
})

afterAll(() => v1Models.sequelize.close())

describe('GET /users', () => {

  test('Get user loaded with profile.', async () => {

    let res = await request(app)
      .get('/v1/users')
      .set('Authorization', `Bearer ${ token }`)

    expect(res.statusCode).toBe(HttpStatusCodes.OK)
    expect(res.body.data.user.profile).toBeTruthy()
  })

})

describe('PUT /users', () => {

  describe('PUT /profiles', () => {
  
    test('profile edit', async () => {
      let res = await request(app)
        .put('/v1/users/profiles')
        .send({
          profileImg: '/asdf',
          greeting: 'asdf'
        })
        .set('Authorization', `Bearer ${ token }`)

        console.log(res.body.data.profile)
        

      expect(res.statusCode).toBe(HttpStatusCodes.OK)

    })

  })

})

describe('DELETE /users', () => {

  describe('DELETE /profiles', () => {

    test('Reset user', async () => {
      let res = await request(app)
        .delete('/v1/users/profiles')
        .set('Authorization', `Bearer ${ token }`)
  
      expect(res.statusCode).toBe(HttpStatusCodes.OK)

    })

  })

})