/**
 * Required External Modules
 */

import * as dotenv from 'dotenv'
import express from 'express'
import helmet from 'helmet'
// import routes from './routes'

dotenv.config()

/**
 * App Variables
 */
const PORT = (process.env.PORT !== undefined) ? parseInt(process.env.PORT) : 3001
const app = express()

/**
 *  App Configuration
 */
app.use(helmet())
app.use(express.json())

/**
 * Server Activation
 */
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
