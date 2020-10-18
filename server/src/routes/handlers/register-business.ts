import express from 'express'
import * as zod from 'zod'
import { register } from '../../services/business'
import {assertAuthenticated} from '../middlewares/auth'

const schema = zod.object({
  name: zod.string()
    .min(1)
    .max(40),

  email: zod.string()
    .email()
    .min(1)
    .max(32),

  handle: zod.string()
    .regex(/^[a-zA-Z0-9_-]{1,15}$/)
    .min(1)
    .max(20),

  logo: zod.any()
    .optional(),

  website: zod.string()
    .url()
    .optional(),

  desciption: zod.string()
    .min(1)
    .max(100)
    .optional(),

})

const handler: express.RequestHandler = async (req, res) => {
  console.log('we are about to register the business!')
  console.log('req.body: ' ,req.body)
  const body = req.body
  // const body = schema.parse(req.body)
  console.log('body: ', body)
  assertAuthenticated(req)
  console.log('authenticated as', req.auth.userId)

  try {
    const response = await register(
      body.name,
      body.email,
      body.handle,
      body.website,
      body.desciption,
      body.logo,
      req.auth.userId,
    )
    res.status(201).json({response})
  } catch (err) {
    if (err.message === 'BusinessNameTaken') {
      res.status(409).json({ error: 'BusinessNameTaken' })
    } else if(err.message ==='BusinessHandleTaken') {
      res.status(409).json({error: 'BusinessHandleTaken'})
    } else {
      console.error('Unexpected error registering business', err)
      res.status(500).send()
    }
  }
}

export default handler