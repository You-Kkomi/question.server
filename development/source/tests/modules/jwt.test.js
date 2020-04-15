require('dotenv').config()

const jwt = require('../../utils/jwt')

describe('jwt logic test', () => {
    
    let payload
    let token

    beforeAll(() => {
        payload = { test: 'test' }
        token = jwt.generate(payload)
    })

    test('jwt generate test', () => {
        expect(token).toMatch(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
    })

    test('jwt check test', () => {
        const result = jwt.check(token)
        expect(result.test).toBe(payload.test)
    })

})