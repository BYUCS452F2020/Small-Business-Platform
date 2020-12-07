import request from 'supertest'
import express from 'express'
import {get as getBusiness} from '../../db/mongo/business'
import handler from './get-business'

jest.mock('../../db/mongo/business')

describe('Get Business Handler', () => {
  let app: express.Application
  let authUserId: string|null = null

  beforeEach(() => {
    (getBusiness as jest.Mock).mockResolvedValue({
      name: 'My Biz',
      handle: 'mybiz',
      email: 'hi@my.biz',
      website: 'http://my.biz',
      logo: 'arsta',
      description: 'My cool business',
      userId: 'abc-123',
    })

    app = express()
    app.get('/business/:handle', (req, res, next) => {
      if (authUserId !== null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req as any).auth = {userId: authUserId}
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return handler(req, res, next).catch((err: any) => {
        console.log('error!', err)
        next(err)
      })
    })
  })

  afterEach(jest.restoreAllMocks)

  it('gets a business', async () => {
    await request(app)
      .get('/business/mybiz')
      .expect(200, {
        name: 'My Biz',
        handle: 'mybiz',
        email: 'hi@my.biz',
        website: 'http://my.biz',
        logo: 'arsta',
        description: 'My cool business',
        editable: false,
      })
  })

  it('sets editable based on authenticated user', async () => {
    authUserId = 'def-456'
    await request(app)
      .get('/business/mybiz')
      .expect(200, {
        name: 'My Biz',
        handle: 'mybiz',
        email: 'hi@my.biz',
        website: 'http://my.biz',
        logo: 'arsta',
        description: 'My cool business',
        editable: false,
      })

    authUserId = 'abc-123'
    await request(app)
      .get('/business/mybiz')
      .expect(200, {
        name: 'My Biz',
        handle: 'mybiz',
        email: 'hi@my.biz',
        website: 'http://my.biz',
        logo: 'arsta',
        description: 'My cool business',
        editable: true,
      })
  })

  it('sends a 404 if business not found', async () => {
    (getBusiness as jest.Mock).mockRejectedValue(new Error('BusinessNotFound'))

    await request(app)
      .get('/business/myotherbiz')
      .expect(404)
  })

  it('sends a 500 for all other errors', async () => {
    (getBusiness as jest.Mock).mockRejectedValue(new Error('ah'))

    await request(app)
      .get('/business/myotherbiz')
      .expect(500)
  })
})
