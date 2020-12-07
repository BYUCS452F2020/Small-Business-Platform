import {compare, hashPassword} from '../util/hash'
import {
  create as createUser,
  getAuthInfo,
} from '../db/mongo/user'
import {create as createAuthToken} from '../db/mongo/auth-token'
import {login, register} from './user'

jest.mock('../util/hash')
jest.mock('../db/mongo/user')
jest.mock('../db/mongo/auth-token')

describe('User Service', () => {
  afterEach(jest.resetAllMocks)

  describe('register', () => {
    beforeEach(() => {
      (hashPassword as jest.Mock).mockResolvedValue('super-awesome-hash')
      ;(createUser as jest.Mock).mockResolvedValue('abc-123')
      ;(createAuthToken as jest.Mock).mockResolvedValue('auth-token-yeah')
    })

    it('creates user and returns auth token', async () => {
      const token = await register('Jason', 'Cox', 'jcox', 'password123', 'jason@mail.com')
      expect(token).toBe('auth-token-yeah')
      expect(hashPassword).toBeCalledWith('password123')
      expect(createUser).toBeCalledWith('Jason', 'Cox', 'jcox', 'super-awesome-hash', 'jason@mail.com')
      expect(createAuthToken).toBeCalledWith('abc-123')
    })

    it('returns null if auth token creation fails', async () => {
      (createAuthToken as jest.Mock).mockRejectedValue(new Error('FailedCreateAuthToken'))
      const token = await register('Jason', 'Cox', 'jcox', 'password123', 'jason@mail.com')
      expect(token).toBeNull()
    })

    it('throws errors from user creation', async () => {
      (createUser as jest.Mock).mockRejectedValue(new Error('ruh-roh'))
      await expect(register('J', 'C', 'jc', 'pw123', 'j@m.com'))
        .rejects
        .toThrow('ruh-roh')

      expect(createAuthToken).not.toBeCalled()
    })
  })

  describe('login', () => {
    beforeEach(() => {
      (compare as jest.Mock).mockResolvedValue(true)
      ;(getAuthInfo as jest.Mock).mockResolvedValue({id: 'abc-123', password: 'hashed'})
      ;(createAuthToken as jest.Mock).mockResolvedValue('auth-token-yeah')
    })

    it('logs in user and returns auth token', async () => {
      const token = await login('jcc', 'abc')
      expect(token).toBe('auth-token-yeah')
      expect(getAuthInfo).toBeCalledWith('jcc')
      expect(compare).toBeCalledWith('abc', 'hashed')
      expect(createAuthToken).toBeCalledWith('abc-123')
    })

    it('throws IncorrectPassword if password incorrect', async () => {
      (compare as jest.Mock).mockResolvedValue(false)
      await expect(login('jcc', 'abc'))
        .rejects
        .toThrow('IncorrectPassword')
    })

    it('throws errors from getting auth info', async () => {
      (getAuthInfo as jest.Mock).mockRejectedValue(new Error('UserNotFound'))
      await expect(login('jcc', 'abc'))
        .rejects
        .toThrow('UserNotFound')
    })

    it('throws errors from creating auth token', async () => {
      (createAuthToken as jest.Mock).mockRejectedValue(new Error('Failed!'))
      await expect(login('jcc', 'abc'))
        .rejects
        .toThrow('Failed!')
    })
  })
})
