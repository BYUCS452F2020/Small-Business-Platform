import pg from 'pg'
import { insert, get } from './portfolio'

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

  describe('get', () => {
    beforeEach(() => {
      (pg.Pool.prototype.query as jest.Mock).mockResolvedValue({
        rows: [
          {itemid: 1, file: 'abc', description: 'def'},
          {itemid: 2, file: 'ghi', description: 'jkl'},
          {itemid: 3, file: 'mno', description: 'pqr'},
        ],
      })
    })

    it('gets all portfolio items for business', async () => {
      const portfolio = await get(123)

      expect(portfolio).toStrictEqual([
        {id: 1, file: 'abc', description: 'def'},
        {id: 2, file: 'ghi', description: 'jkl'},
        {id: 3, file: 'mno', description: 'pqr'},
      ])

      expect(pg.Pool.prototype.query).toBeCalledWith(
        expect.stringMatching(/^SELECT.*FROM portfolio.*WHERE businessID/s),
        expect.any(Array),
      )
    })

    it('throws FailedGetPortfolio if an error occurs', async () => {
      (pg.Pool.prototype.query as jest.Mock).mockRejectedValue(new Error('oops'))
      await expect(get(123)).rejects.toThrow('FailedGetPortfolio')
    })
  })
})
