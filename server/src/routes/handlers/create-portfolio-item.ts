import express from 'express'
import * as zod from 'zod'
import { assertAuthenticated } from '../middlewares/auth'
import { createItem } from '../../services/portfolio'

const schema = zod.object({
  description: zod.string()
    .min(1)
    .max(100),

  file: zod.string()
    .min(1),
})

const handler: express.RequestHandler = async (req, res) => {
  const handle = req.params.handle
  if (!handle) {
    res.status(400).send()
    return
  }

  const body = schema.parse(req.body)
  assertAuthenticated(req)

  try {
    await createItem(
      body.description,
      body.file,
      handle,
    )
    res.status(201).send()
  } catch (err) {
    if (err.message === 'BusinessNotFound') {
      res.status(404).send()
    } else {
      console.error('Unexpected error adding portfolio item', err)
      res.status(500).send()
    }
  }
}

export default handler
