const request = require('supertest')
const randomString = require('random-string')
const HttpStatusCodes = require('http-status-codes')

const app = require('../../app')
const v1Models = require('../../models/v1')
const jwtUtil = require('../../utils/jwt')

let token
let questionId
let questionTitle
let questionContent
let answerId
let answerContent

beforeAll( async () => {
    const user = await v1Models.User.create({
        nickname: randomString(),
        password: randomString()
    })

    token = jwtUtil.generate({ id: user.id, nickname: user.nickname })

    questionTitle = randomString({ length: 30 })
    questionContent = randomString({ length: 200 })
    answerContent = randomString({ length: 25 })
})

afterAll(() => {

})

describe('POST /question', () => {

    test('질문을 추가합니다.', async () => {
        const res = await request(app)
            .post('/question')
            .send({
                questionTitle,
                questionContent
            })
            .set('Authorization', `Bearer ${token}`)
        
        expect(res.statusCode).toBe(HttpStatusCodes.OK)
        expect(res.body.data.title).toBe(questionTitle)
        expect(res.body.data.content).toBe(questionContent)

        questionId = res.body.data.id
    })

    describe('POST /answer', () => {

        test('질문에 답변을 등록합니다.', async () => {
            const res = await request(app)
                .post(`/question/${questionId}/answer`)
                .send({
                    content: answerContent
                })
                .set('Authorization', `Bearer ${token}`)

            expect(res.statusCode).toBe(HttpStatusCodes.OK)

            const answer = res.body.data.answers.find(answer => answer.id == answerId)

            expect(answer).toBeTruthy()
            expect(answer.content).toBe(answerContent)
            
            answerId = answer.id
        })

    })

})

describe('GET /question', () => {

    test('질문을 가져올때 답변을 함께 가져옵니다.', async () => {
        const res = await request(app)
            .get(`/question/${questionId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toBe(HttpStatusCodes.OK)
        expect(res.body.data.title).toBe(questionTitle)
        expect(res.body.data.content).toBe(questionContent)
        expect(res.body.data.answers).toBeTruthy()
    })

})

describe('PUT /question', () => {

    const updatedTitle = randomString({ length: 30 })
    const updatedContent = randomString({ length: 200 })
    const updatedAnswer = randomString({ length: 24 })

    test('질문을 수정합니다.', async () => {
        const res = await request(app)
            .put(`/question/${questionId}/answer/${answerId}`)
            .send({
                title: updatedTitle,
                content: updatedContent
            })
            .set('Authorization', `Bearer ${token}`)
        
        expect(res.statusCode).toBe(HttpStatusCodes.OK)
        expect(res.body.data.title).toBe(updatedTitle)
        expect(res.body.data.content).toBe(updatedContent)
    })

    test('자신의 질문이 아닌 다른 질문을 수정시 403을 반환합니다.', async () => {
        const res = await request(app)
            .put(`/question/${questionId}/answer/${answerId}`)
            .send({
                title: updatedTitle,
                content: updatedContent
            })

        expect(res.statusCode).toBe(HttpStatusCodes.FORBIDDEN)
    })

    describe('PUT /answer', () => {
        
        test('질문에 답변을 수정합니다.', async () => {
            const res = await request(app)
                .put(`/question/${questionId}/answer/${answerId}`)
                .send({
                    title: updatedTitle,
                    content: updatedContent
                })
                .set('Authorization', `Bearer ${token}`)
        
            expect(res.statusCode).toBe(HttpStatusCodes.OK)
            
            const answer = res.body.data.answers.find(answer => answer.id == answerId)

            expect(answer.content).toBe(updatedContent)
        })

        test('자신의 답변이 아닌 다른 답변을 수정시 403을 반환합니다.', async () => {
            const res = await request(app)
                .put(`/question/${questionId}/answer/${answerId}`)
                .send({
                    title: updatedTitle,
                    content: updatedContent
                })
    
            expect(res.statusCode).toBe(HttpStatusCodes.FORBIDDEN)
        })

    })

})

describe('DELETE /question', () => {

    test('질문 삭제합니다.', async () => {
        const res = await request(app)
            .delete(`/question/${questionId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toBe(HttpStatusCodes.OK)
    })

    test('자신의 질문이 아닌 다른 질문을 삭제시 403을 반환합니다.', async () => {
        const res = await request(app)
            .delete(`/question/${questionId}`)
            
        expect(res.statusCode).toBe(HttpStatusCodes.FORBIDDEN)
    })

    describe('DELETE /answer', () => {
        
        test('질문의 답변을 삭제합니다.', async () => {
            const res = await request(app)
                .delete(`/question/${questionId}/answer/${answerId}`)
                .set('Authorization', `Bearer ${token}`)
    
            expect(res.statusCode).toBe(HttpStatusCodes.OK)
        })

        test('자신의 질문이 아닌 다른 질문을 삭제시 403을 반환합니다.', async () => {
            const res = await request(app)
                .delete(`/question/${questionId}/answer/${answerId}`)
            
            expect(res.statusCode).toBe(HttpStatusCodes.FORBIDDEN)
        })

    })

})