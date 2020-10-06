import express from 'express'
import registerUser from './handlers/register-user'
import handleError from './handlers/error'

// Express doesn't handle errors thrown in async code, so this does
function withErrHandling(handler: express.RequestHandler): express.RequestHandler {
  return (req, res, next) => {
    return Promise.resolve(handler(req, res, next))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((err: any) => next(err))
  }
}

export function set(app: express.Application): void {
  app.post('/user/register', withErrHandling(registerUser))

  // error handling - must be last!
  app.use(handleError)
}


