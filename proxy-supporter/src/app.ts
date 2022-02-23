/**
 * Required External Modules
 */

import * as dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import yargs from 'yargs/yargs';
//import routes from './routes';

dotenv.config();

/**
 * App Variables
 */

// Argument parser
const argv = yargs(process.argv.slice(2)).options({
  port: {
    alias: 'p',
    description: 'Port to serve the application.',
    type: 'number'
  }
}).help().parseSync();

const PORT: number = argv.port || parseInt(process.env.PORT as string, 10);
const app = express();

/**
 *  App Configuration
 */

app.use(helmet());
app.use(express.json());

/**
 * Server Activation
 */

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
