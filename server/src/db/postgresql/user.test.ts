import pg from 'pg'
import {create, getAuthInfo} from './user'

jest.mock('pg')

describe('User DB', () => {
  afterEach(jest.resetAllMocks)

  describe('create', () => {
    beforeEach(() => {
      (pg.Pool as unknown as jest.Mock).mockRestore()
      ;(pg.Pool.prototype.query as jest.Mock).mockResolvedValue({
        rows: [
          {id: 123},
        ],
      })
    })

    it('inserts a new user and returns its id', async () => {
      const result = await create('Jason', 'Cox', 'jcc', 'password123', 'j@mail.com')
      expect(result).toBe(123)
      expect(pg.Pool.prototype.query).toBeCalledWith(
        expect.stringMatching(/^INSERT INTO "user"/),
        expect.any(Array),
      )
    })

    it('throws UsernameTaken if unique violation occurs', async () => {
      (pg.Pool.prototype.query as jest.Mock).mockRejectedValue({code: '23505'})

      await expect(create('J', 'C', 'jc', 'pw123', 'j@mail.com'))
        .rejects
        .toThrow('UsernameTaken')
    })

    it('throws FailedCreateUser if other error occurs', async () => {
      (pg.Pool.prototype.query as jest.Mock).mockRejectedValue({code: 'uhoh'})

      await expect(create('J', 'C', 'jc', 'pw123', 'j@mail.com'))
        .rejects
        .toThrow('FailedCreateUser')
    })
  })

  describe('get auth info', () => {
    beforeEach(() => {
      (pg.Pool as unknown as jest.Mock).mockRestore()
      ;(pg.Pool.prototype.query as jest.Mock).mockResolvedValue({
        rows: [
          {id: 123, password: 'abc'},
        ],
      })
    })

    it('gets the user id and password', async () => {
      const result = await getAuthInfo('jcc')

      expect(result).toEqual({id: 123, password: 'abc'})
      expect(pg.Pool.prototype.query).toBeCalledWith(
        expect.stringMatching(/^SELECT id, password FROM "user"/),
        expect.any(Array),
      )
    })

    it('throws UserNotFound if user not in db', async () => {
      (pg.Pool.prototype.query as jest.Mock).mockResolvedValue({rows: []})

      await expect(getAuthInfo('jcc'))
        .rejects
        .toThrow('UserNotFound')
    })

    it('throws FailedGetAuthInfo if other error occurs', async () => {
      (pg.Pool.prototype.query as jest.Mock).mockRejectedValue({code: 'oops'})

      await expect(getAuthInfo('jcc'))
        .rejects
        .toThrow('FailedGetAuthInfo')
    })
  })
})
