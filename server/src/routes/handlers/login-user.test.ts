import request from 'supertest'
import express from 'express'
import {login} from '../../services/user'
import handler from './login-user'
import {ZodError} from 'zod'

jest.mock('../../services/user')

describe('Register User Handler', () => {
  let app: express.Application

  beforeEach(() => {
    (login as jest.Mock).mockResolvedValue('cool-token')

    app = express()
    app.use(express.json())
    app.post('/', (req, res, next) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return handler(req, res, next).catch((err: any) => {
        next(err)
      })
    })
  })

  afterEach(jest.resetAllMocks)

  it('logs in a user and responds with auth token', async () => {
    await request(app)
      .post('/')
      .send({
        username: 'j-THE_man.5',
        password: 'password123',
      })
      .expect(200, {
        authToken: 'cool-token',
      })

    expect(login).toBeCalledWith('j-THE_man.5', 'password123')
  })

  it('sends 401 if password incorrect', async () => {
    (login as jest.Mock).mockRejectedValue(new Error('IncorrectPassword'))

    await request(app)
      .post('/')
      .send({
        username: 'j-THE_man.5',
        password: 'password123',
      })
      .expect(401)
  })

  it('sends 404 if user not found', async () => {
    (login as jest.Mock).mockRejectedValue(new Error('UserNotFound'))

    await request(app)
      .post('/')
      .send({
        username: 'j-THE_man.5',
        password: 'password123',
      })
      .expect(404)
  })

  it('sends 500 on unexpected errors', async () => {
    (login as jest.Mock).mockRejectedValue(new Error('Eeek!'))

    await request(app)
      .post('/')
      .send({
        username: 'j-THE_man.5',
        password: 'password123',
      })
      .expect(500)
  })

  describe('body validation', () => {
    const tests = [
      {
        name: 'missing everything',
        body: {},
      },
      {
        name: 'missing username',
        body: {
          password: 'password123',
        },
      },
      {
        name: 'missing password',
        body: {
          username: 'jcox',
        },
      },
      {
        name: 'username empty',
        body: {
          username: '',
          password: 'password123',
        },
      },
      {
        name: 'username too long',
        body: {
          username: 'ihaveasuperlongusername',
          password: 'password123',
        },
      },
      {
        name: 'username invalid chars',
        body: {
          username: 'jason!',
          password: 'password123',
        },
      },
      {
        name: 'password too short',
        body: {
          username: 'jcox',
          password: '1234567',
        },
      },
      {
        name: 'password too long',
        body: {
          username: 'jcox',
          password: 'abcdefghijklmnopqrstuvwxyz.abcdefghijklmnopqrstuvwxyz.abcdefghijklmnopqrstuvwxyz',
        },
      },
    ]

    beforeEach(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const catcher: express.ErrorRequestHandler = (err, req, res, next) => {
        expect(err.constructor).toBe(ZodError)
        res.status(400).send()
      }

      app.use(catcher)
    })

    for (const {name, body} of tests) {
      it(`throws ZodError when ${name}`, async () => {
        await request(app)
          .post('/')
          .send(body)
          .expect(400)
      })
    }
  })
})
