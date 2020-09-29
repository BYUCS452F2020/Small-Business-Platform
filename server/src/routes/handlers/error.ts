import express from 'express'
import * as zod from 'zod'

// Express doesn't recognize it as an error handler with < 4 params
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handler: express.ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof zod.ZodError) {
    res.status(400).json({error: err.errors})
  } else {
    console.error('Received unexpected error from route', err)
    res.status(500).send()
  }
}

export default handler
