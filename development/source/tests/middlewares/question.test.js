const request = require('supertest')
const HttpStatusCodes = require('http-status-codes')
const randomString = require('random-string')

const app = require('../../app')
const v1Models = require('../../models/v1')
const jwtUtil = require('../../utils/jwt')

let user

let otherUser

let question

let answer

let token

let otherToken

beforeAll(async() => {
  user = await v1Models.User.create({
    nickname: randomString(),
    password: randomString()
  })

  otherUser = await v1Models.User.create({
    nickname: randomString(),
    password: randomString()
  })

  token = jwtUtil.generate({ id: user.id, nickname: user.nickname })
  otherToken = jwtUtil.generate({ id: otherUser.id, nickname: otherUser.nickname })

  question = await v1Models.Question.create({
    userId: user.id,
    title: randomString(),
    content: randomString()
  })

  answer = await v1Models.Answer.create({
    questionId: question.id,
    userId: user.id,
    content: randomString()
  })
  
})

afterAll(() => v1Models.sequelize.close())

describe('질문 유효성 검사 테스트', () => {

  const updatedTitle = randomString()
  const updatedContent = randomString()

  test('존재하지 않는 답변을 요청 할 경우 404를 반환합니다.', async() => {
    let res = await request(app)
      .put('/v1/questions/-1/')
      .send({
        title: updatedTitle,
        content: updatedContent
      })
      .set('Authorization', `Bearer ${ token }`)

    expect(res.statusCode).toBe(HttpStatusCodes.NOT_FOUND)
  })

  test('토큰이 존재하지 않는 경우에서 요청할 경우 403을 반환합니다.', async() => {
    let res = await request(app)
      .put(`/v1/questions/${question.id}/`)
      .send({
        title: updatedTitle,
        content: updatedContent
      })

    expect(res.statusCode).toBe(HttpStatusCodes.FORBIDDEN)
  })

  test('토큰이 올바르게 존재하는 경우에서 요청할 경우 200을 반환 합니다.', async() => {
    let res = await request(app)
      .put(`/v1/questions/${question.id}/`)
      .send({
        title: updatedTitle,
        content: updatedContent
      })
      .set('Authorization', `Bearer ${ token }`)

    expect(res.statusCode).toBe(HttpStatusCodes.OK)
  })

  test('토큰이 올바르지 않게 존재하는 경우에서 요청할 경우 403을 반환합니다.', async() => {
    let res = await request(app)
      .put(`/v1/questions/${question.id}/`)
      .send({
        title: updatedTitle,
        content: updatedContent
      })
      .set('Authorization', 'Bearer aosdhialis')

    expect(res.statusCode).toBe(HttpStatusCodes.FORBIDDEN)
  })

  test('다른 사람의 질문 조작을 요청 할 경우 403을 반환합니다.', async() => {
    let res = await request(app)
      .put(`/v1/questions/${question.id}/`)
      .send({
        title: updatedTitle,
        content: updatedContent
      })
      .set('Authorization', `Bearer ${ otherToken }`)

    expect(res.statusCode).toBe(HttpStatusCodes.FORBIDDEN)
  })
})


describe('답변 유효성 검사 테스트', () => {

  const updatedContent = randomString()

  test('존재하지 않는 답변을 요청 할 경우 404를 반환합니다.', async() => {
    let res = await request(app)
      .put(`/v1/questions/${question.id}/answers/-1`)
      .send({
        content: updatedContent
      })
      .set('Authorization', `Bearer ${ token }`)

    expect(res.statusCode).toBe(HttpStatusCodes.NOT_FOUND)
  })

  test('토큰이 존재하지 않는 경우에서 요청 할 경우 403을 반환합니다.', async() => {
    let res = await request(app)
      .put(`/v1/questions/${question.id}/answers/${answer.id}`)
      .send({
        content: updatedContent
      })

    expect(res.statusCode).toBe(HttpStatusCodes.FORBIDDEN)
  })

  test('토큰이 올바르게 존재하는 경우에서 요청 할 경우 403을 반환합니다.', async() => {
    let res = await request(app)
      .put(`/v1/questions/${question.id}/answers/${answer.id}`)
      .send({
        content: updatedContent
      })
      .set('Authorization', `Bearer ${ token }`)

    expect(res.statusCode).toBe(HttpStatusCodes.OK)
  })

  test('토큰이 올바르지 않게 존재하는 경우에서 요청 할 경우 403을 반환합니다.', async() => {
    let res = await request(app)
      .put(`/v1/questions/${question.id}/answers/${answer.id}`)
      .send({
        content: updatedContent
      })
      .set('Authorization', 'Bearer aosdhialis')

    expect(res.statusCode).toBe(HttpStatusCodes.FORBIDDEN)
  })

  test('다른 사람의 답변 변경 요청 할 경우 403을 반환합니다.', async() => {
    let res = await request(app)
      .put(`/v1/questions/${question.id}/answers/${answer.id}`)
      .send({
        content: updatedContent
      })
      .set('Authorization', `Bearer ${ otherToken }`)

    expect(res.statusCode).toBe(HttpStatusCodes.FORBIDDEN)
  })
})
