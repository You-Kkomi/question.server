const request = require('supertest')
const randomString = require('random-string')
const HttpStatusCodes = require('http-status-codes')

const app = require('../../app')
const v1Models = require('../../models/v1')
const jwtUtil = require('../../utils/jwt')

let token
let user
let questionId
let questionTitle
let questionContent
let answerId
let answerContent

beforeAll( async () => {
    user = await v1Models.User.create({
        nickname: randomString(),
        password: randomString()
    })

    token = jwtUtil.generate({ id: user.id, nickname: user.nickname })

    questionTitle = `${randomString({ length: 30 })}a`
    questionContent = randomString({ length: 200 })
    answerContent = randomString({ length: 25 })
})

afterAll(() => { v1Models.sequelize.close() })

describe('POST /questions', () => {

    test('질문을 추가합니다.', async () => {
        const res = await request(app)
            .post('/v1/questions/')
            .send({
                title: questionTitle,
                content: questionContent
            })
            .set('Authorization', `Bearer ${token}`)
        
        expect(res.statusCode).toBe(HttpStatusCodes.CREATED)
        expect(res.body.data.question.title).toBe(questionTitle)
        expect(res.body.data.question.content).toBe(questionContent)
        expect(res.body.data.question.userId).toBe(user.id)

        questionId = res.body.data.question.id
    })

    test('질문을 추가할 떄 제목이 빈칸이면 400을 반환합니다.', async () => {
        const res = await request(app)
            .post('/v1/questions/')
            .send({
                title: '',
                content: questionContent
            })
            .set('Authorization', `Bearer ${token}`)
        
        expect(res.statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
    })

    test('질문을 추가할 떄 본문이 빈칸이면 400을 반환합니다.', async () => {
        const res = await request(app)
            .post('/v1/questions/')
            .send({
                title: questionTitle,
                content: ''
            })
            .set('Authorization', `Bearer ${token}`)
        
        expect(res.statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
    })

    describe('POST /answers', () => {

        test('질문에 답변을 등록합니다.', async () => {
            const res = await request(app)
                .post(`/v1/questions/${questionId}/answers/`)
                .send({
                    content: answerContent
                })
                .set('Authorization', `Bearer ${token}`)

            expect(res.statusCode).toBe(HttpStatusCodes.CREATED)
            expect(res.body.data.answer.questionId).toBe(questionId)
            expect(res.body.data.answer.content).toBe(answerContent)
            
            answerId = res.body.data.answer.id
        })

    })

})

describe('GET /questions', () => {

    test('아이디를 기준으로 검색을 하고 질문과 답변을 함께 가져옵니다.', async () => {
        const res = await request(app)
            .get(`/v1/questions/${questionId}`)
        
        expect(res.statusCode).toBe(HttpStatusCodes.OK)

        const question = res.body.data.question

        expect(question.title).toBe(questionTitle)
        expect(question.content).toBe(questionContent)
        expect(question.answers).toBeTruthy()
    })

    test('타이틀을 기준으로 검색을 하고 질문과 답변을 함께 가져옵니다.', async () => {
        const res = await request(app)
            .get(`/v1/questions`)
            .query(`title=a`)

        expect(res.statusCode).toBe(HttpStatusCodes.OK)

        const question = res.body.data.questions[0]

        expect(question.title).toBe(questionTitle)
        expect(question.content).toBe(questionContent)
        expect(question.answers).toBeTruthy()
    })

})

describe('PUT /questions', () => {

    const updatedTitle = randomString({ length: 30 })
    const updatedContent = randomString({ length: 200 })
    const updatedAnswer = randomString({ length: 24 })

    test('질문을 수정합니다.', async () => {
        const res = await request(app)
            .put(`/v1/questions/${questionId}/`)
            .send({
                title: updatedTitle,
                content: updatedContent
            })
            .set('Authorization', `Bearer ${token}`)
        
        expect(res.statusCode).toBe(HttpStatusCodes.OK)
    })

    test('질문의 제목을 빈칸으로 수정 할 경우 400 에러를 발생시킵니다.', async () => {
        const res = await request(app)
            .put(`/v1/questions/${questionId}/`)
            .send({
                title: '',
                content: updatedContent
            })
            .set('Authorization', `Bearer ${token}`)
        
        expect(res.statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
    })

    test('질문의 본문을 빈칸으로 수정 할 경우 400 에러를 발생시킵니다.', async () => {
        const res = await request(app)
            .put(`/v1/questions/${questionId}/`)
            .send({
                title: updatedTitle,
                content: ''
            })
            .set('Authorization', `Bearer ${token}`)
        
        expect(res.statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
    })

    describe('PUT /answers', () => {
        
        test('답변을 수정합니다.', async () => {
            const res = await request(app)
                .put(`/v1/questions/${questionId}/answers/${answerId}/`)
                .send({
                    content: updatedAnswer
                })
                .set('Authorization', `Bearer ${token}`)
        
            expect(res.statusCode).toBe(HttpStatusCodes.OK)
        })

        test('답변을 빈칸으로 수정 할 경우 400 에러를 발생시킵니다.', async () => {
            const res = await request(app)
                .put(`/v1/questions/${questionId}/answers/${answerId}/`)
                .send({
                    content: ''
                })
                .set('Authorization', `Bearer ${token}`)
        
            expect(res.statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
        })

    })

})

describe('DELETE /questions', () => {

    describe('DELETE /answers', () => {

        test('질문의 답변을 삭제합니다.', async () => {
            const res = await request(app)
                .delete(`/v1/questions/${questionId}/answers/${answerId}/`)
                .set('Authorization', `Bearer ${token}`)
    
            expect(res.statusCode).toBe(HttpStatusCodes.OK)
        })

    })
    
    test('질문 삭제합니다.', async () => {
        const res = await request(app)
            .delete(`/v1/questions/${questionId}/`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toBe(HttpStatusCodes.OK)
    })

})