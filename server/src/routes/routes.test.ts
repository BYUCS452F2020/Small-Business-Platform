import request from 'supertest'
import express from 'express'
import registerUser from './handlers/register-user'
import loginUser from './handlers/login-user'
import registerBusiness from './handlers/register-business'
import createPortfolioItem from './handlers/create-portfolio-item'
import getBusiness from './handlers/get-business'
import getPortfolio from './handlers/get-portfolio'
import handleError from './handlers/error'
import { set as setRoutes } from './routes'
import authMiddleware, { authMiddlewareOptional } from './middlewares/auth'

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
jest.mock('./handlers/create-portfolio-item')
jest.mock('./handlers/get-portfolio')

describe('Routes', () => {
  let app: express.Application

  beforeEach(() => {
    app = express()
    setRoutes(app)

    ;(authMiddleware as jest.Mock).mockImplementation((req, res, next) => {
      req.auth = { userId: 123 }
      next()
    })

    ;(authMiddlewareOptional as jest.Mock).mockImplementation((req, res, next) => {
      next()
    })
  })

  afterEach(jest.restoreAllMocks)

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
      {
        method: 'post',
        path: '/business/handle/portfolio',
        handler: createPortfolioItem,
      },
      {
        method: 'get',
        path: '/business/handle/portfolio',
        handler: getPortfolio,
      },
    ]

    for (const { method, path, handler } of routes) {
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
