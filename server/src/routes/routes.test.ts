import request from 'supertest'
import express from 'express'
import registerUser from './handlers/register-user'
import handleError from './handlers/error'
import {set as setRoutes} from './routes'

jest.mock('./handlers/register-user')
jest.mock('./handlers/error', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return jest.fn((err, req, res, next) => {
    res.status(500).send()
  })
})

describe('Routes', () => {
  let app: express.Application

  beforeEach(() => {
    app = express()
    setRoutes(app)
    ;(registerUser as jest.Mock).mockImplementation(async () => {
      throw new Error('ahhh')
    })
  })

  describe('async error handling', () => {
    const routes = [
      {
        method: 'post',
        path: '/user/register',
      },
      {
        method: 'post',
        path: '/user/login',
      },
    ]

    for (const {method, path} of routes) {
      it(`${method} ${path} handles async errors`, async () => {
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
