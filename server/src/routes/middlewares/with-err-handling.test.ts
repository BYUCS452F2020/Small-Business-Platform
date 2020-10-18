import express from 'express'
import withErrHandling from './with-err-handling'

describe('with err handling midldeware', () => {
  const syncThrower: express.RequestHandler = () => {
    throw new Error('ahh!')
  }

  const asyncThrower: express.RequestHandler = async () => {
    throw new Error('ahh!')
  }

  it('calls next with error on sync error', async () => {
    const next = jest.fn()
    const handler = withErrHandling(syncThrower)
    await handler({} as express.Request, {} as express.Response, next)
    expect(next).toBeCalledWith(expect.objectContaining({message: 'ahh!'}))
  })

  it('calls next with error on async error', async () => {
    const next = jest.fn()
    const handler = withErrHandling(asyncThrower)
    await handler({} as express.Request, {} as express.Response, next)
    expect(next).toBeCalledWith(expect.objectContaining({message: 'ahh!'}))
  })
})
