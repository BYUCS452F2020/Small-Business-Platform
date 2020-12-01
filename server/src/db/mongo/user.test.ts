import {MongoClient} from 'mongodb'
import {connect, getDB} from './db'
import {init, create, getAuthInfo} from './user'

describe('User DB', () => {
  let client: MongoClient

  beforeAll(async () => {
    client = await connect()
    await init()
  })

  afterAll(async () => {
    await client.close()
  })

  beforeEach(async () => {
    await getDB().collection('users').deleteMany({})
  })

  afterEach(jest.resetAllMocks)

  describe('create', () => {
    it('inserts a new user and returns its id', async () => {
      const id = await create('Jason', 'Cox', 'jcc', 'password123', 'j@mail.com')
      expect(id).toMatch(/[a-z0-9]+/)
    })

    it('throws UsernameTaken if unique violation occurs', async () => {
      await create('Jason', 'Cox', 'jcc', 'password123', 'j@mail.com')
      await expect(create('Jason', 'Cox', 'jcc', 'password123', 'j@mail.com'))
        .rejects
        .toThrow('UsernameTaken')
    })
  })

  describe('get auth info', () => {
    it('gets the user id and password', async () => {
      const id = await create('Jason', 'Cox', 'jcc', 'password123', 'j@mail.com')
      const result = await getAuthInfo('jcc')
      expect(result).toEqual({id, password: 'password123'})
    })

    it('throws UserNotFound if user not in db', async () => {
      await expect(getAuthInfo('jcc'))
        .rejects
        .toThrow('UserNotFound')
    })
  })
})
