import {MongoClient} from 'mongodb'
import {connect, getDB} from './db'
import {init, insert, get} from './portfolio'

describe('Portfolio DB', () => {
  let client: MongoClient
  beforeAll(async () => {
    client = await connect()
    await init()
  })
  afterAll(async () => {
    await client.close()
  })

  beforeEach(async () => {
    await getDB().collection('portfolio').deleteMany({})
  })

  afterEach(jest.resetAllMocks)

  describe('insert', () => {
    it('inserts a new portfolio and returns its id', async () => {
      const id = await insert('This is the coolest portfolio item description ever', 'string_representation_of_the_image', 'ID_OF_THE_BUSINESS')
      expect(id).toMatch(/[a-z0-9]+/)
    })    
  })

  describe('get portfolio items', () => {
    it('gets the portfolio items (id, file, and description)', async () => {
      await insert('This is the coolest portfolio item description ever', 'string_representation_of_the_image', 'ID_OF_THE_BUSINESS')
      await insert('This is the coolest portfolio item description ever times 2', 'string_representation_of_the_image01', 'ID_OF_THE_BUSINESS')
      const result = await get('ID_OF_THE_BUSINESS')
      expect(result[0]).toMatchObject(
        {
          file: 'string_representation_of_the_image',
          description: 'This is the coolest portfolio item description ever',
          businessId: 'ID_OF_THE_BUSINESS'
        })
      expect(result[1]).toMatchObject(
        {
          file: 'string_representation_of_the_image01',
          description: 'This is the coolest portfolio item description ever times 2',
          businessId: 'ID_OF_THE_BUSINESS'
        })
    })

    it('returns empty array when no items are in the DB', async () => {
      await expect(get('id_that_does_not_exist'))
      .resolves
      .toEqual([])
    })
  })
})