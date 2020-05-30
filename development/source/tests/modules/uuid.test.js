const uuid4 = require('../../utils/uuid4')

describe('uuid4 logic test', () => {
  test('uuid4 generate ordered uuid4', () => {
    expect(uuid4.generate()).toMatch(/\b4[0-9A-Fa-f]{31}\b/g)
  })
})
