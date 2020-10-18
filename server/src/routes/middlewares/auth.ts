import express from 'express'
import withErrHandling from './with-err-handling'
import {getUserId} from '../../db/auth-token'

type AuthenticatedReq = express.Request & {
  auth: {
    userId: number
  }
}

export function assertAuthenticated(
  req: express.Request,
): asserts req is AuthenticatedReq {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!(req as any).auth || !(typeof (req as any).auth.userId === 'number')) {
    throw new Error('MissingAuthData')
  }
}

const auth: express.RequestHandler = async (req, res, next) => {
  const header = req.get('Authorization')
  if (!header) {
    res.status(401).send()
    return
  }

  const matches = /^\s*Bearer ([-a-f0-9]+)\s*$/i.exec(header)
  if (!matches) {
    res.status(401).send()
    return
  }

  const token = matches[1]
  if (!token) {
    res.status(401).send()
    return
  }

  try {
    (req as AuthenticatedReq).auth = {userId: await getUserId(token)}
    next()
  } catch (err) {
    if (err.message === 'TokenNotFound') {
      res.status(401).send()
    } else {
      throw err
    }
  }
}

export default withErrHandling(auth)
