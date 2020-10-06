import pg from 'pg'
import {v4 as uuid} from 'uuid'
import {create} from './auth-token'

jest.mock('pg')
jest.mock('uuid')

describe('Auth Token DB', () => {
  afterEach(jest.resetAllMocks)

  describe('create', () => {
    beforeEach(() => {
      (pg.Pool as unknown as jest.Mock).mockRestore()
      ;(uuid as jest.Mock).mockReturnValue('some-unique-id')
    })

    it('generates and inserts an auth token', async () => {
      const result = await create(123)
      expect(result).toBe('some-unique-id')
      expect(pg.Pool.prototype.query).toBeCalledWith(
        expect.stringMatching(/^INSERT INTO auth_token/),
        ['some-unique-id', 123, expect.any(Date)],
      )
    })

    it('throws FailedCreateAuthToken if an error occurs', async () => {
      (pg.Pool.prototype.query as jest.Mock).mockRejectedValue({code: 'uhoh'})

      await expect(create(123))
        .rejects
        .toThrow('FailedCreateAuthToken')
    })
  })
})
