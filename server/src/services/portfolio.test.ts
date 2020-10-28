import {insert as insertItem} from '../db/portfolio'
import {getId as getBusinessId} from '../db/business'
import {createItem} from './portfolio'

jest.mock('../db/portfolio')
jest.mock('../db/business')

describe('Portfolio service', () => {
  afterEach(jest.resetAllMocks)

  describe('create item', () => {
    beforeEach(() => {
      (getBusinessId as jest.Mock).mockResolvedValue(123)
    })

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
})
