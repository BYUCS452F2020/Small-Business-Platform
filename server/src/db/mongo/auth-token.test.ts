import {MongoClient} from 'mongodb'
import {connect, getDB} from './db'
import {v4 as uuid} from 'uuid'
import {init, create, getUserId} from './auth-token'

jest.mock('uuid')

describe('Auth Token DB', () => {
  let client: MongoClient

  beforeAll(async () => {
    client = await connect()
    await init()
  })

  afterAll(async () => {
    await client.close()
  })

  beforeEach(async () => {
    await getDB().collection('authTokens').deleteMany({})
  })

  afterEach(jest.resetAllMocks)

  describe('create', () => {
    beforeEach(() => {
      (uuid as jest.Mock).mockReturnValue('some-unique-id')
    })

    it('generates and inserts an auth token', async () => {
      const result = await create('abc-123')
      expect(result).toBe('some-unique-id')
    })
  })

  describe('get user id', () => {
    it('gets the user id', async () => {
      const token = await create('abc-123')
      const userId = await getUserId(token)
      expect(userId).toBe('abc-123')
    })

    it('throws TokenNotFound if no token is found', async () => {
      await expect(getUserId('some-token')).rejects.toThrow('TokenNotFound')
    })
  })
})
