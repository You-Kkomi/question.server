const randomString = require('random-string')

const v1Models = require('../../models/v1')

describe('test question', () => {

    let user
    let question
    let ansewer

    beforeAll(async () => {
        user = await v1Models.User.create({
            nickname: randomString(),
            password: randomString()
        })

        question = await v1Models.Question.create({
            title: randomString(),
            content: randomString(),
            userId: user.id
        })
    })

    afterAll(() => v1Models.sequelize.close())

    describe('test question', () => {

    })

})