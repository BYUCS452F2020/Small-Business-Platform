import { MongoClient } from 'mongodb'
import {connect, getDB} from './db'
import {init, create, get, getId } from './business'

describe('Business DB', () => {
  let client: MongoClient

  beforeAll(async () => {
    client = await connect()
    await init()
  })

  afterAll(async () => {
    await client.close()
  })

  beforeEach(async () => {
    await getDB().collection('business').deleteMany({})
  })

  afterEach(jest.resetAllMocks)

  describe('create', () => {
    it('inserts a new user and returns its id', async () => {
      const id = await create('Nate', 'nate@gmail.com', 'nateteahanfilm', 'nate123')
      expect(id).toMatch(/[a-z0-9]+/)
    })

    it('throws BusinesNameTaken if unique violation occurs', async () => {
      await create('Nate', 'nate@gmail.com', 'nateteahanfilm', 'nate123')
      await expect(create('Nate', 'nate@gmail.com', 'nateteahanfilm', 'nate123'))
        .rejects
        .toThrow('BusinessNameTaken')
    })

    it('throws BusinesHandleTaken if unique violation occurs', async () => {
      await create('Nate', 'nate@gmail.com', 'nateteahanfilm', 'nate123')
      await expect(create('Nathan', 'nate@gmail.com', 'nateteahanfilm', 'nate123'))
        .rejects
        .toThrow('BusinessHandleTaken')
    })
  })

  describe('get', () => {
    it('Gets a business and all its fields from the database', async () => {
      await create('Nate', 'nate@gmail.com', 'nateteahanfilm', 'nate123')
      const result = await get('nateteahanfilm')
      expect(result).toEqual({name: 'Nate', email: 'nate@gmail.com', handle: 'nateteahanfilm', userID: 'nate123', website: undefined, description: undefined, logo: undefined})
    })

    it('Gets a business id of an already created business', async () => {
      const id = await create('Nate', 'nate@gmail.com', 'nateteahanfilm', 'nate123')
      const result = await getId('nateteahanfilm')
      expect(result).toEqual(id)
    })
  })
})
