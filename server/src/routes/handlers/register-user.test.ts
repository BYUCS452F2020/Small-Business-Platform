import request from 'supertest'
import express from 'express'
import {register} from '../../services/user'
import handler from './register-user'
import {ZodError} from 'zod'

jest.mock('../../services/user')

describe('Register User Handler', () => {
  let app: express.Application

  beforeEach(() => {
    (register as jest.Mock).mockResolvedValue('cool-token')

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

  it('registers a user and responds with auth token', async () => {
    await request(app)
      .post('/')
      .send({
        firstName: 'Jason',
        lastName: 'Cox',
        username: 'j-THE_man.5',
        password: 'password123',
        email: 'jc@mail.com',
      })
      .expect(201, {
        authToken: 'cool-token'
      })

    expect(register).toBeCalledWith('Jason', 'Cox', 'j-THE_man.5', 'password123', 'jc@mail.com')
  })


  it('sends 409 if username taken', async () => {
    (register as jest.Mock).mockRejectedValue(new Error('UsernameTaken'))

    await request(app)
      .post('/')
      .send({
        firstName: 'Jason',
        lastName: 'Cox',
        username: 'j-THE_man.5',
        password: 'password123',
        email: 'jc@mail.com',
      })
      .expect(409)
  })

  it('sends 500 on unexpected errors', async () => {
    (register as jest.Mock).mockRejectedValue(new Error('Eeek!'))

    await request(app)
      .post('/')
      .send({
        firstName: 'Jason',
        lastName: 'Cox',
        username: 'j-THE_man.5',
        password: 'password123',
        email: 'jc@mail.com',
      })
      .expect(500)
  })

  describe('body validation', () => {
    const tests = [
      {
        name: 'missing everything',
        body: {}
      },
      {
        name: 'missing first name',
        body: {
          lastName: 'Cox',
          username: 'jcox',
          password: 'password123',
          email: 'jc@mail.com',
        },
      },
      {
        name: 'missing last name',
        body: {
          firstName: 'Jason',
          username: 'jcox',
          password: 'password123',
          email: 'jc@mail.com',
        },
      },
      {
        name: 'missing username',
        body: {
          firstName: 'Jason',
          lastName: 'Cox',
          password: 'password123',
          email: 'jc@mail.com',
        },
      },
      {
        name: 'missing password',
        body: {
          firstName: 'Jason',
          lastName: 'Cox',
          username: 'jcox',
          email: 'jc@mail.com',
        },
      },
      {
        name: 'missing email',
        body: {
          firstName: 'Jason',
          lastName: 'Cox',
          username: 'jcox',
          password: 'password123',
        },
      },
      {
        name: 'first name empty',
        body: {
          firstName: '',
          lastName: 'Cox',
          username: 'jcox',
          password: 'password123',
          email: 'jc@mail.com',
        },
      },
      {
        name: 'last name empty',
        body: {
          firstName: 'Jason',
          lastName: '',
          username: 'jcox',
          password: 'password123',
          email: 'jc@mail.com',
        },
      },
      {
        name: 'username empty',
        body: {
          firstName: 'Jason',
          lastName: 'Cox',
          username: '',
          password: 'password123',
          email: 'jc@mail.com',
        },
      },
      {
        name: 'username too long',
        body: {
          firstName: 'Jason',
          lastName: 'Cox',
          username: 'ihaveasuperlongusername',
          password: 'password123',
          email: 'jc@mail.com',
        },
      },
      {
        name: 'username invalid chars',
        body: {
          firstName: 'Jason',
          lastName: 'Cox',
          username: 'jason!',
          password: 'password123',
          email: 'jc@mail.com',
        },
      },
      {
        name: 'password too short',
        body: {
          firstName: 'Jason',
          lastName: 'Cox',
          username: 'jcox',
          password: '1234567',
          email: 'jc@mail.com',
        },
      },
      {
        name: 'password too long',
        body: {
          firstName: 'Jason',
          lastName: 'Cox',
          username: 'jcox',
          password: 'abcdefghijklmnopqrstuvwxyz.abcdefghijklmnopqrstuvwxyz.abcdefghijklmnopqrstuvwxyz',
          email: 'jc@mail.com',
        },
      },
      {
        name: 'email invalid',
        body: {
          firstName: 'Jason',
          lastName: 'Cox',
          username: 'jcox',
          password: 'password123',
          email: 'jc@mail',
        },
      },
      {
        name: 'email too long',
        body: {
          firstName: 'Jason',
          lastName: 'Cox',
          username: 'jcox',
          password: 'password123',
          email: 'jasonsuperlongnamecox@ilovetotypehugedomains.com',
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
