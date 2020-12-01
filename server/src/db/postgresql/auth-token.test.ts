import pg from 'pg'
import {v4 as uuid} from 'uuid'
import {create, getUserId} from './auth-token'

jest.mock('pg')
jest.mock('uuid')

describe('Auth Token DB', () => {
  beforeEach(() => {
    (pg.Pool as unknown as jest.Mock).mockRestore()
  })

  afterEach(jest.resetAllMocks)

  describe('create', () => {
    beforeEach(() => {
      (uuid as jest.Mock).mockReturnValue('some-unique-id')
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

  describe('get user id', () => {
    it('gets the user id', async () => {
      (pg.Pool.prototype.query as jest.Mock).mockResolvedValue({
        rows: [
          {user_id: 123},
        ],
      })

      const userId = await getUserId('1-b-3')

      expect(userId).toBe(123)
      expect(pg.Pool.prototype.query).toBeCalledWith(
        expect.stringMatching(/^SELECT user_id.*FROM auth_token.*WHERE.*expire_time >/s),
        ['1-b-3', expect.any(Date)],
      )
    })

    it('throws TokenNotFound if no token is found', async () => {
      (pg.Pool.prototype.query as jest.Mock).mockResolvedValue({rows: []})

      await expect(getUserId('1-b-3')).rejects.toThrow('TokenNotFound')
    })

    it('throws FailedGetUserId on all other errors', async () => {
      (pg.Pool.prototype.query as jest.Mock).mockRejectedValue(new Error('ah'))

      await expect(getUserId('1-b-3')).rejects.toThrow('FailedGetUserId')
    })
  })
})
