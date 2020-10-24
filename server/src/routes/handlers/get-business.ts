import express from 'express'
import {assertAuthenticated} from '../middlewares/auth'
import {get as getBusiness} from '../../db/business'

const handler: express.RequestHandler = async (req, res) => {
  const handle = req.params.handle
  if (!handle) {
    res.status(400).send()
    return
  }

  assertAuthenticated(req)

  try {
    const business = await getBusiness(handle)
    res.status(200).json({
      name: business.name,
      handle: business.handle,
      email: business.email,
      website: business.website,
      logo: business.logo,
      description: business.description,
      editable: business.userId === req.auth.userId,
    })
  } catch (err) {
    switch(err.message) {
    case 'BusinessNotFound':
      res.status(404).send()
      break
    default:
      console.error('Unexpected error getting business', err)
      res.status(500).send()
    }
  }
}

export default handler
