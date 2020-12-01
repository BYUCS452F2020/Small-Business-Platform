import express from 'express'
import withErrHandling from './with-err-handling'
import {getUserId} from '../../db/postgresql/auth-token'

type AuthenticatedReq = express.Request & {
  auth: {
    userId: number
  }
}

export function assertAuthenticated(
  req: express.Request,
): asserts req is AuthenticatedReq {
  if (!isAuthenticated(req)) {
    throw new Error('MissingAuthData')
  }
}

export function isAuthenticated(req: express.Request): req is AuthenticatedReq {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req as any).auth && (typeof (req as any).auth.userId === 'number')
}

function makeAuth(optional?: boolean): express.RequestHandler {
  const auth: express.RequestHandler = async (req, res, next) => {
    const header = req.get('Authorization')
    if (!header) {
      if (optional) {
        next()
      } else {
        res.status(401).send()
      }

      return
    }

    const matches = /^\s*Bearer ([-a-f0-9]+)\s*$/i.exec(header)
    if (!matches) {
      if (optional) {
        next
      } else {
        res.status(401).send()
      }

      return
    }

    const token = matches[1]
    if (!token) {
      if (optional) {
        next()
      } else {
        res.status(401).send()
      }

      return
    }

    try {
      (req as AuthenticatedReq).auth = {userId: await getUserId(token)}
      next()
    } catch (err) {
      if (optional) {
        next()
      } else if (err.message === 'TokenNotFound') {
        res.status(401).send()
      } else {
        throw err
      }
    }
  }

  return auth
}

export default withErrHandling(makeAuth())

export const authMiddlewareOptional = withErrHandling(makeAuth(true))
