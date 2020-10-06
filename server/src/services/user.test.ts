import {hashPassword} from '../util/hash'
import {create as createUser} from '../db/user'
import {create as createAuthToken} from '../db/auth-token'
import {register} from './user'

jest.mock('../util/hash')
jest.mock('../db/user')
jest.mock('../db/auth-token')

describe('User Service', () => {
  afterEach(jest.resetAllMocks)

  describe('register', () => {
    beforeEach(() => {
      (hashPassword as jest.Mock).mockResolvedValue('super-awesome-hash')
      ;(createUser as jest.Mock).mockResolvedValue(123)
      ;(createAuthToken as jest.Mock).mockResolvedValue('auth-token-yeah')
    })

    it('creates user and returns auth token', async () => {
      const token = await register('Jason', 'Cox', 'jcox', 'password123', 'jason@mail.com')
      expect(token).toBe('auth-token-yeah')
      expect(hashPassword).toBeCalledWith('password123')
      expect(createUser).toBeCalledWith('Jason', 'Cox', 'jcox', 'super-awesome-hash', 'jason@mail.com')
      expect(createAuthToken).toBeCalledWith(123)
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
})
