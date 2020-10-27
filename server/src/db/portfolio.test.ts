import pg from 'pg'
import { insert } from './portfolio'

jest.mock('pg')

describe('Portfolio DB', () => {
  beforeEach(() => {
    (pg.Pool as unknown as jest.Mock).mockRestore()
  })

  afterEach(jest.resetAllMocks)

  describe('create', () => {
    it('inserts a portfolio item', async () => {
      await insert('desc', 'file', 123)
      expect(pg.Pool.prototype.query).toBeCalledWith(
        expect.stringMatching(/^INSERT INTO portfolio/),
        expect.any(Array),
      )
    })

    it('throws FailedInsertPortfolioItem if an error occurs', async () => {
      (pg.Pool.prototype.query as jest.Mock).mockRejectedValue({code: 'thisCodeWillFail'})
      await expect(insert('description-string,', 'file-string', 123))
        .rejects
        .toThrow('FailedInsertPortfolioItem')
    })

  })
})
