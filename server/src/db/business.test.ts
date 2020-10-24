import pg from 'pg'
import { create } from './business'

jest.mock('pg')

describe('Business DB', () => {
  afterEach(jest.resetAllMocks)

  describe('create', () => {
    beforeEach(() => {
      (pg.Pool as unknown as jest.Mock).mockRestore()
      ; (pg.Pool.prototype.query as jest.Mock).mockResolvedValue({
        rows: [
          { id: 123 },
        ],
      })
    })

    it('inserts a new business and throw no errors', async () => {
      await create(
        'Nate Hood LLC', 'nate@hood.com', '@n8thegr8', 'www.linkedin.com/n8',
        'This is a business to help all other businesses make money by paying us',
        undefined, 123,
      )
      expect(pg.Pool.prototype.query).toBeCalledWith(
        expect.stringMatching(/^INSERT INTO "business"/),
        expect.any(Array),
      )
    })

    it('throws FailedCreateBusiness if an error occurs', async () => {
      (pg.Pool.prototype.query as jest.Mock).mockRejectedValue({code: 'thisCodeWillFail'})
      await expect(create(
        'Nate Hood LLC', 'nate@hood.com', '@n8thegr8', 'www.linkedin.com/n8',
        'This is a business to help all other businesses make money by paying us',
        undefined, 123,
      ))
        .rejects
        .toThrow('FailedCreateBusiness')
    })

    it('throws BusinessNameTaken if err.constraint === businessNameTaken', async() => {
      (pg.Pool.prototype.query as jest.Mock).mockRejectedValue({constraint: 'business_name_key'})
      await expect(create(
        'Nate Hood LLC', 'nate@hood.com', '@n8thegr8', 'www.linkedin.com/n8',
        'This is a business to help all other businesses make money by paying us',
        undefined, 123,
      ))
        .rejects
        .toThrow('BusinessNameTaken')
    })

    it('throws BusinessHandleTaken if err.constraint === business_handle_key', async() => {
      (pg.Pool.prototype.query as jest.Mock).mockRejectedValue({constraint: 'business_handle_key'})
      await expect(create(
        'Nate Hood LLC', 'nate@hood.com', '@n8thegr8', 'www.linkedin.com/n8',
        'This is a business to help all other businesses make money by paying us',
        undefined, 123,
      ))
        .rejects
        .toThrow('BusinessHandleTaken')
    })
  })
})