import pg from 'pg'
import { create, get } from './business'

jest.mock('pg')

describe('Business DB', () => {
  beforeEach(() => {
    (pg.Pool as unknown as jest.Mock).mockRestore()
  })

  afterEach(jest.resetAllMocks)

  describe('create', () => {
    beforeEach(() => {
      (pg.Pool.prototype.query as jest.Mock).mockResolvedValue({
        rows: [
          { id: 123 },
        ],
      })
    })

    it('inserts a new business and throw no errors', async () => {
      await create(
        'Nate Hood LLC', 'nate@hood.com', '@n8thegr8', 123, 'www.linkedin.com/n8',
        'This is a business to help all other businesses make money by paying us',
        undefined,
      )
      expect(pg.Pool.prototype.query).toBeCalledWith(
        expect.stringMatching(/^INSERT INTO "business"/),
        expect.any(Array),
      )
    })

    it('throws FailedCreateBusiness if an error occurs', async () => {
      (pg.Pool.prototype.query as jest.Mock).mockRejectedValue({code: 'thisCodeWillFail'})
      await expect(create(
        'Nate Hood LLC', 'nate@hood.com', '@n8thegr8', 123, 'www.linkedin.com/n8',
        'This is a business to help all other businesses make money by paying us',
        undefined,
      ))
        .rejects
        .toThrow('FailedCreateBusiness')
    })

    it('throws BusinessNameTaken if err.constraint === businessNameTaken', async() => {
      (pg.Pool.prototype.query as jest.Mock).mockRejectedValue({constraint: 'business_name_key'})
      await expect(create(
        'Nate Hood LLC', 'nate@hood.com', '@n8thegr8', 123, 'www.linkedin.com/n8',
        'This is a business to help all other businesses make money by paying us',
        undefined,
      ))
        .rejects
        .toThrow('BusinessNameTaken')
    })

    it('throws BusinessHandleTaken if err.constraint === business_handle_key', async() => {
      (pg.Pool.prototype.query as jest.Mock).mockRejectedValue({constraint: 'business_handle_key'})
      await expect(create(
        'Nate Hood LLC', 'nate@hood.com', '@n8thegr8', 123, 'www.linkedin.com/n8',
        'This is a business to help all other businesses make money by paying us',
        undefined,
      ))
        .rejects
        .toThrow('BusinessHandleTaken')
    })
  })

  describe('get', () => {
    beforeEach(() => {
      (pg.Pool.prototype.query as jest.Mock).mockResolvedValue({
        rows: [
          {
            name: 'My Biz',
            handle: 'mybiz',
            email: 'hi@my.biz',
            userid: 123,
            website: 'http://my.biz',
            logo: Buffer.from('hey there', 'utf-8'),
            description: 'My cool business',
          },
        ],
      })
    })

    it('gets a business', async () => {
      const business = await get('mybiz')

      expect(business).toMatchObject({
        name: 'My Biz',
        handle: 'mybiz',
        email: 'hi@my.biz',
        userId: 123,
        website: 'http://my.biz',
        logo: 'hey there',
        description: 'My cool business',
      })

      expect(pg.Pool.prototype.query).toBeCalledWith(
        expect.stringMatching(/^SELECT.*FROM business.*WHERE handle = \$[0-9]/s),
        expect.any(Array),
      )
    })

    it('throws BusinessNotFound if business not found', async () => {
      (pg.Pool.prototype.query as jest.Mock).mockResolvedValue({rows: []})

      await expect(get('myotherbiz')).rejects.toThrow('BusinessNotFound')
    })

    it('throws FailedGetBusiness on other errors', async () => {
      (pg.Pool.prototype.query as jest.Mock).mockRejectedValue(new Error('ah'))

      await expect(get('myotherbiz')).rejects.toThrow('FailedGetBusiness')
    })
  })
})
