import express from 'express'
import registerUser from './handlers/register-user'
import loginUser from './handlers/login-user'
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
  // TODO: remove this once front- and back-ends are hosted on same domain
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.header('Access-Control-Allow-Headers', '*')
    next()
  })

  app.post('/user/register', withErrHandling(registerUser))
  app.post('/user/login', withErrHandling(loginUser))

  // TODO: use a real router here - this is just for frontend testing
  app.post('/business/register', (req, res) => res.status(200).send())

  // error handling - must be last!
  app.use(handleError)
}

