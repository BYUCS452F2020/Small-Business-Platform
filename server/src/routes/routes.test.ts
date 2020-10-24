import request from 'supertest'
import express from 'express'
import registerUser from './handlers/register-user'
import loginUser from './handlers/login-user'
import registerBusiness from './handlers/register-business'
import getBusiness from './handlers/get-business'
import handleError from './handlers/error'
import {set as setRoutes} from './routes'
import authMiddleware from './middlewares/auth'

jest.mock('./handlers/error', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return jest.fn((err, req, res, next) => {
    res.status(500).send()
  })
})
jest.mock('./middlewares/auth')

jest.mock('./handlers/register-user')
jest.mock('./handlers/login-user')
jest.mock('./handlers/register-business')
jest.mock('./handlers/get-business')

describe('Routes', () => {
  let app: express.Application

  beforeEach(() => {
    app = express()
    setRoutes(app)

    ;(authMiddleware as jest.Mock).mockImplementation((req, res, next) => {
      req.auth = {userId: 123}
      next()
    })
  })

  describe('async error handling', () => {
    const routes = [
      {
        method: 'post',
        path: '/user/register',
        handler: registerUser,
      },
      {
        method: 'post',
        path: '/user/login',
        handler: loginUser,
      },
      {
        method: 'post',
        path: '/business/register',
        handler: registerBusiness,
      },
      {
        method: 'get',
        path: '/business/handle',
        handler: getBusiness,
      },
    ]

    for (const {method, path, handler} of routes) {
      it(`${method} ${path} handles async errors`, async () => {
        (handler as jest.Mock).mockImplementation(async () => {
          throw new Error('ahhh')
        })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (request(app) as any)[method](path)
          .expect(500)

        expect(handleError).toBeCalledWith(
          expect.any(Error),
          expect.anything(),
          expect.anything(),
          expect.anything(),
        )
      })
    }
  })
})
