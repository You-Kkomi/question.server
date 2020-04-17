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
    let token

    beforeAll(async () => {
        nickname = randomString()
        password = randomString()

        const user = await v1Models.User.create({
            nickname,
            password
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

        test('login fail cause invalide password', async () => {
            let response = await request(app)
                .post('/v1/auth/login')
                .send({
                    nickname,
                    password: 'asdf'
                })
    
            expect(response.statusCode).toBe(HttpStatusCodes.NOT_FOUND)
        })

        test('login successfully', async () => {
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

            token = response.body.data.token
        })
    })

    describe('logout test', () => {
        test('logout successfully', async () => {
            let response = await request(app)
                .delete('/v1/auth/logout')
                .set('Authorization', `Baerer ${token}`)

            expect(response.statusCode).toBe(HttpStatusCodes.OK)
        })
    })
})