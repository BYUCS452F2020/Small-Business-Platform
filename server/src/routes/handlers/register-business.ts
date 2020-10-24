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

  description: zod.string()
    .min(1)
    .max(100)
    .optional()
})

const handler: express.RequestHandler = async (req, res) => {
  const body = schema.parse(req.body)
  // TODO: assertAuthenticated(req) // Do this when user auth backend is working

  try {
    const response = await register(
      body.name,
      body.email,
      body.handle,
      body.website,
      body.description,
      body.logo,
      123 // TODO: replace 123 with req.auth.userId,
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