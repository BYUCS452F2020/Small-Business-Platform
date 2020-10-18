import request from 'supertest'
import express from 'express'
import authMiddleware, {assertAuthenticated} from './auth'
import {getUserId} from '../../db/auth-token'

jest.mock('../../db/auth-token')

describe('auth middleware', () => {
  let app: express.Application
  let handler: jest.Mock

  beforeEach(() => {
    handler = jest.fn().mockImplementation((req, res) => {
      assertAuthenticated(req)
      res.status(200).send()
    })

    app = express()
    app.post('/', authMiddleware, handler)
  })

  afterEach(jest.resetAllMocks)

  it('sends 401 if authorization header is missing', async () => {
    await request(app)
      .post('/')
      .expect(401)
  })

  it('sends 401 if authorization header is not of type bearer', async () => {
    await request(app)
      .post('/')
      .set('Authorization', 'Basic 123abc')
      .expect(401)
  })

  it('sends 401 if authorization header is missing token', async () => {
    await request(app)
      .post('/')
      .set('Authorization', 'Bearer')
      .expect(401)
  })

  it('sends 401 if token not found', async () => {
    (getUserId as jest.Mock).mockRejectedValue(new Error('TokenNotFound'))

    await request(app)
      .post('/')
      .set('Authorization', 'Bearer 1-b-3')
      .expect(401)
  })

  it('calls next with authenticated req if token found', async () => {
    (getUserId as jest.Mock).mockResolvedValue(123)

    await request(app)
      .post('/')
      .set('Authorization', 'Bearer 1-b-3')
      .expect(200)

    expect(handler).toBeCalledWith(
      expect.objectContaining({auth: {userId: 123}}),
      expect.anything(),
      expect.anything(),
    )
  })

  it('sends 500 on error getting user id', async () => {
    (getUserId as jest.Mock).mockRejectedValue(new Error('uh oh'))

    await request(app)
      .post('/')
      .set('Authorization', 'Bearer 1-b-3')
      .expect(500)
  })
})
