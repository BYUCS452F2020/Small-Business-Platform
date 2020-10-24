import pg from 'pg'
import { insert } from './portfolio'

jest.mock('pg')

describe('Portfolio DB', () => {
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

    it('inserts a new portfolio and throw no errors', async () => {
      await insert(
        'description-string,', 'file-string', 123
      )
      expect(pg.Pool.prototype.query).toBeCalledWith(
        expect.stringMatching(/^INSERT INTO portfolio/),
        expect.any(Array),
      )
    })

    it('throws FailedCreatePortfolio if an error occurs', async () => {
      (pg.Pool.prototype.query as jest.Mock).mockRejectedValue({code: 'thisCodeWillFail'})
      await expect(insert(
        'description-string,', 'file-string', 123
      ))
        .rejects
        .toThrow('FailedCreatePortfolio')
    })

  })
})