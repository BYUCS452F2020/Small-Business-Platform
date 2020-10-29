import request from 'supertest'
import express from 'express'
import {getPortfolio} from '../../services/portfolio'
import handler from './get-portfolio'

jest.mock('../../services/portfolio')

describe('Get Portfolio Handler', () => {
  let app: express.Application

  beforeEach(() => {
    (getPortfolio as jest.Mock).mockResolvedValue([
      {id: 1, file: 'a', description: 'b'},
      {id: 2, file: 'c', description: 'd'},
      {id: 3, file: 'e', description: 'f'},
    ])

    app = express()
    app.use(express.json())
    app.get('/:handle', (req, res, next) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return handler(req, res, next).catch((err: any) => {
        next(err)
      })
    })
  })

  afterEach(jest.resetAllMocks)

  it('gets a business\'s portfolio', async () => {
    await request(app)
      .get('/mybiz')
      .expect(200, {
        items: [
          {id: 1, file: 'a', description: 'b'},
          {id: 2, file: 'c', description: 'd'},
          {id: 3, file: 'e', description: 'f'},
        ],
      })

    expect(getPortfolio).toBeCalledWith('mybiz')
  })

  it('sends 404 if business not found', async () => {
    (getPortfolio as jest.Mock).mockRejectedValue(new Error('BusinessNotFound'))

    await request(app)
      .get('/mybiz')
      .expect(404)
  })

  it('sends 500 on other errors', async () => {
    (getPortfolio as jest.Mock).mockRejectedValue(new Error('rip'))

    await request(app)
      .get('/mybiz')
      .expect(500)
  })
})

