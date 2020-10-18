import express from 'express'

type Handler = express.RequestHandler

// Express doesn't handle errors thrown in async code, so this does
export default function withErrHandling(handler: Handler): Handler {
  return (req, res, next) => {
    try {
      return Promise.resolve(handler(req, res, next))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((err: any) => next(err))
    } catch (err) {
      next(err)
    }
  }
}
