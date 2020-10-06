import {createTables} from './db/db'
import express from 'express'
import {set as setRoutes} from './routes/routes'

(async () => {
  // make sure database tables exist
  try {
    await createTables()
  } catch (err) {
    console.error('Unexpected error creating tables', err)
    process.exit(1)
  }

  const app = express()
  const port = process.env.PORT || 8080

  // parse json request bodies
  app.use(express.json())

  setRoutes(app)

  app.listen(port, () => console.log(`Server running on port ${port}`))
})()

