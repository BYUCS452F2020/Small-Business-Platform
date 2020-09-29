import request from 'supertest'
import express from 'express'
import handler from './error'
import {ZodError} from 'zod'

describe('Error Request Handler', () => {
  let app: express.Application

  beforeEach(() => {
    app = express()
  })

  it('sends 400 on ZodErrors', async () => {
    app.post('/', (req, res, next) => next(new ZodError([])))
    app.use(handler)

    await request(app)
      .post('/')
      .expect(400)
  })

  it('sends 500 on all other errors', async () => {
    app.post('/', (req, res, next) => next(new Error('ahh')))
    app.use(handler)

    await request(app)
      .post('/')
      .expect(500)
  })
})
