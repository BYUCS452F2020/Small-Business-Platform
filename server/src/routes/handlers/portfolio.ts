import express from 'express'
import * as zod from 'zod'
import { assertAuthenticated } from '../middlewares/auth'
import { insertPortfolioItem } from '../../services/portfolio'

const schema = zod.object({
  description: zod.string(),
  file: zod.string(),
})

const handler: express.RequestHandler = async (req, res) => {
  const handle = req.params.handle
  const body = schema.parse(req.body)
  console.log('handle: ', handle)
  console.log('description: ', body.description)
  console.log('handle: ', handle)
  assertAuthenticated(req)
  try {
    await insertPortfolioItem(
      body.description,
      body.file,
      handle,
    )
    res.status(201).send()
  } catch (err) {
    console.error('Unexpected error adding portfolio item', err)
    res.status(500).send()
  }
}

export default handler