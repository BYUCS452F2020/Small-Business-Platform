import express from 'express'
import {getPortfolio} from '../../services/portfolio'

const handler: express.RequestHandler = async (req, res) => {
  const handle = req.params.handle
  if (!handle) {
    res.status(400).send()
    return
  }

  try {
    const portfolio = await getPortfolio(handle)
    res.status(200).json({items: portfolio})
  } catch (err) {
    if (err.message === 'BusinessNotFound') {
      res.status(404).send()
    } else {
      console.log('unexpected error getting portfolio', handle, err)
      res.status(500).send()
    }
  }
}

export default handler
