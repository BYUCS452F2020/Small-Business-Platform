import express from 'express'
import * as zod from 'zod'
import {login} from '../../services/user'

const schema = zod.object({
  username: zod.string()
    .regex(/^[-_.a-zA-Z0-9]+$/)
    .min(1)
    .max(20),

  password: zod.string()
    .min(8)
    .max(64),
})

const handler: express.RequestHandler = async (req, res) => {
  const body = schema.parse(req.body)

  try {
    const authToken = await login(body.username, body.password)

    res.status(200).json({authToken})
  } catch (err) {
    switch (err.message) {
    case 'IncorrectPassword':
      res.status(401).json({error: 'IncorrectPassword'})
      break
    case 'UserNotFound':
      res.status(404).json({error: 'UserNotFound'})
      break
    default:
      console.error('Unexpected error registering user', err)
      res.status(500).send()
    }
  }

}

export default handler
