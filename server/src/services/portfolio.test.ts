import {
  insert as insertItem,
  get as getPortfolioDb,
} from '../db/postgresql/portfolio'
import {getId as getBusinessId} from '../db/postgresql/business'
import {createItem, getPortfolio} from './portfolio'

jest.mock('../db/postgresql/portfolio')
jest.mock('../db/postgresql/business')

describe('Portfolio service', () => {
  beforeEach(() => {
    (getBusinessId as jest.Mock).mockResolvedValue(123)
  })

  afterEach(jest.resetAllMocks)

  describe('create item', () => {
    it('inserts portfolio item for business', async () => {
      await createItem('desc', 'file', 'handle')

      expect(getBusinessId).toBeCalledWith('handle')
      expect(insertItem).toBeCalledWith('desc', 'file', 123)
    })

    it('passes on errors from getting business id', async () => {
      (getBusinessId as jest.Mock).mockRejectedValue(new Error('BusinessNotFound'))
      await expect(createItem('desc', 'file', 'handle'))
        .rejects
        .toThrow('BusinessNotFound')
    })

    it('passes on errors from inserting item', async () => {
      (insertItem as jest.Mock).mockRejectedValue(new Error('Oops'))
      await expect(createItem('desc', 'file', 'handle'))
        .rejects
        .toThrow('Oops')
    })
  })

  describe('get portfolio', () => {
    beforeEach(() => {
      (getPortfolioDb as jest.Mock).mockResolvedValue([
        {id: 1, file: 'a', description: 'b'},
        {id: 2, file: 'c', description: 'd'},
        {id: 3, file: 'e', description: 'f'},
      ])
    })

    it('gets portfolio for business', async () => {
      const portfolio = await getPortfolio('mybiz')

      expect(portfolio).toStrictEqual([
        {id: 1, file: 'a', description: 'b'},
        {id: 2, file: 'c', description: 'd'},
        {id: 3, file: 'e', description: 'f'},
      ])

      expect(getBusinessId).toBeCalledWith('mybiz')
      expect(getPortfolioDb).toBeCalledWith(123)
    })

    it('passes on errors from getting business id', async () => {
      (getBusinessId as jest.Mock).mockRejectedValue(new Error('BusinessNotFound'))
      await expect(getPortfolio('handle'))
        .rejects
        .toThrow('BusinessNotFound')
    })

    it('passes on errors from getting portfolio', async () => {
      (getPortfolioDb as jest.Mock).mockRejectedValue(new Error('Oops'))
      await expect(getPortfolio('handle'))
        .rejects
        .toThrow('Oops')
    })
  })
})
