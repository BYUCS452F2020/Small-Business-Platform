import express from 'express'
import * as zod from 'zod'
import {register} from '../../services/user'

const schema = zod.object({
  firstName: zod.string()
    .min(1)
    .max(20),

  lastName: zod.string()
    .min(1)
    .max(20),

  username: zod.string()
    .regex(/^[-_.a-zA-Z0-9]+$/)
    .min(1)
    .max(20),

  password: zod.string()
    .min(8)
    .max(64),

  email: zod.string()
    .email()
    .min(5)
    .max(32),
})

const handler: express.RequestHandler = async (req, res) => {
  const body = schema.parse(req.body)

  try {
    const authToken = await register(
      body.firstName,
      body.lastName,
      body.username,
      body.password,
      body.email,
    )

    res.status(201).json({authToken})
  } catch (err) {
    if (err.message === 'UsernameTaken') {
      res.status(409).json({error: 'UsernameTaken'})
    } else {
      console.error('Unexpected error registering user', err)
      res.status(500).send()
    }
  }

}

export default handler
