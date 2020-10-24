import express from 'express'
import * as zod from 'zod'
import {assertAuthenticated} from '../middlewares/auth'
import {insertPortfolioItem} from '../../services/portfolio'

const schema = zod.object({
  description: zod.string(),
  file: zod.string(),
  handle: zod.string()
})

const handler: express.RequestHandler = async (req, res) => {
  const body = schema.parse(req.body)
  assertAuthenticated(req)
  try{
    await insertPortfolioItem(
      body.description,
      body.file,
      body.handle
    )
    res.status(201).send()
  } catch(err) {
    res.status(500).send()
  }
}

export default handler