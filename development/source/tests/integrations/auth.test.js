const request = require('supertest')
const randomString = require('random-string')
const HttpStatusCodes = require('http-status-codes')

const app = require('../../app')
const v1Models = require('../../models/v1')
const jwtUtil = require('../../utils/jwt')

afterAll(() => v1Models.sequelize.close())

describe('auth test', () => {

    let nickname
    let password

    beforeAll(async () => {
        nickname = randomString()
        password = randomString()
    })

    describe('register test', () => {
        test('register fail cause invalide body', async () => {
            let response = await request(app)
                .post('/v1/auth/register')
                .send({})

            expect(response.statusCode).toBe(HttpStatusCodes.BAD_REQUEST)
        })

        test('register successfully', async () => {
            let response = await request(app)
                .post('/v1/auth/register')
                .send({
                    nickname,
                    password
                })

            expect(response.statusCode).toBe(HttpStatusCodes.OK)
        })
    })

    describe('login test', () => {

        test('login fail cause invalide info', async () => {
            let response = await request(app)
                .post('/v1/auth/login')
                .send({
                    nickname: 'asdf',
                    password
                })
    
            expect(response.statusCode).toBe(HttpStatusCodes.NOT_FOUND)
        })

        test('login successfully', async () => {
            // POST /v1/auth/login

            let response = await request(app)
                .post('/v1/auth/login')
                .send({
                    nickname,
                    password
                })

            expect(response.statusCode).toBe(HttpStatusCodes.OK)
            expect(response.body.data.token).not.toBe(null)

            const payload = jwtUtil.check(response.body.data.token)

            expect(payload.nickname).toBe(nickname)
        })
    })

})