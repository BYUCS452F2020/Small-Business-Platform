import express from 'express'
import registerUser from './handlers/register-user'
import registerBusiness from './handlers/register-business'
import createPortfolioItem from './handlers/create-portfolio-item'
import getPortfolio from './handlers/get-portfolio'
import loginUser from './handlers/login-user'
import getBusiness from './handlers/get-business'
import handleError from './handlers/error'
import withErrHandling from './middlewares/with-err-handling'
import authMiddleware, { authMiddlewareOptional } from './middlewares/auth'

export function set(app: express.Application): void {
  // TODO: remove this once front- and back-ends are hosted on same domain
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.header('Access-Control-Allow-Headers', '*')
    next()
  })

  app.post('/user/register', withErrHandling(registerUser))
  app.post('/user/login', withErrHandling(loginUser))
  app.post('/business/register', authMiddleware, withErrHandling(registerBusiness))
  app.post('/business/:handle/portfolio', authMiddleware, withErrHandling(createPortfolioItem))
  app.get('/business/:handle/portfolio', authMiddleware, withErrHandling(getPortfolio))
  app.get('/business/:handle', authMiddlewareOptional, withErrHandling(getBusiness))

  // error handling - must be last!
  app.use(handleError)
}

