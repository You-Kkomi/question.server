const bcrypt = require('bcrypt')
const randomgString= require('random-string')

const v1Models = require('../../models/v1')

describe('user test', () => {
    let user
    let password

    beforeAll( async () => {
        password = randomgString()
        user = await v1Models.User.create({
            nickname: randomgString(),
            password
        })
    })

    afterAll(() => v1Models.sequelize.close())

    describe('create user', () => {
        test('Create user, crypt password', async () => {
            const isMatch = await bcrypt.compare(password, user.password)

            expect(isMatch).toBe(true)
        })

        test('Create user, user_profile is createed', async () => {
            const profile = await v1Models.UserProfile.findOne({
                where: {
                    userId: user.id
                }
            })

            expect(profile).toBeTruthy()
            expect(profile.userId).toBe(user.id)
        })
    })
})