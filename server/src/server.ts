import express from 'express'
import {set as setRoutes} from './routes/routes'
import {connect} from './db/mongo/db'
import {init as initUserCollection} from './db/mongo/user'
import {init as initAuthTokenCollection} from './db/mongo/auth-token'

(async () => {
  // set up database
  try {
    await connect()
    await initUserCollection()
    await initAuthTokenCollection()
  } catch (err) {
    console.error('Unexpected error connecting to mongo', err)
    process.exit(1)
  }

  const app = express()
  const port = process.env.PORT || 8080

  // parse json request bodies
  app.use(express.json({limit: '10mb'}))

  setRoutes(app)

  app.listen(port, () => console.log(`Server running on port ${port}`))
})()

