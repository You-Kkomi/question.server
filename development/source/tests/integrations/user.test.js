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
let user

beforeAll(async () => {
  nickname = randomString()
  password = randomString()
})

afterAll(() => v1Models.sequelize.close())

describe('POST /users', () => {
  test('유저를 생성합니다.', async () => {
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
    user = res.body.data
  })

  test('이미 존재하는 닉넴으로 유저를 생성하면 400 에러를 발생시킵니다.', async () => {
    let res = await request(app)
      .post('/v1/users')
      .send({
        nickname,
        password
      })

    expect(res.statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
  })

  test('닉네임의 길이가 20보다 크다면 400 에러를 발생시킵니다.', async () => {
    let res = await request(app)
      .post('/v1/users/')
      .send({
        nickname: randomString({ length: 30 }),
        password
      })

    expect(res.statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
  })
})

describe('GET /users', () => {
  test('유저를 조회할때 유저의 프로필도 함께 조회를 합니다.', async () => {
    let res = await request(app)
      .get('/v1/users')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(HttpStatusCodes.OK)
  })

  describe('GET /user/:id', () => {
    test('다른 사람의 유저 정보를 조회 합니다.', async () => {
      let res = await request(app)
        .get(`/v1/users/${user.id}`)

        expect(res.statusCode).toBe(HttpStatusCodes.OK)
    })
  })
})

describe('PUT /users', () => {
  describe('PUT /', () => {
    test('유저의 패스워드를 수정합니다.', async () => {
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
    test('유저의 프로필을 수정합니다.', async () => {
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
    test('유저의 프로필을 초기화 합니다.', async () => {
      let res = await request(app)
        .delete('/v1/users/profiles')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(HttpStatusCodes.OK)
      expect(res.body.data.profile.profileImg).toBe(null)
      expect(res.body.data.profile.greeting).toBe(null)
    })
  })

  describe('DELETE /', () => {
    test('유저를 삭제합니다.', async () => {
      let res = await request(app)
        .delete('/v1/users')
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(HttpStatusCodes.OK)
    })
  })
})