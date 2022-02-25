import * as dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import fetch from 'node-fetch';
import swagger from './api/swagger.js';
import routes from './api/rest/routes.js';

dotenv.config();

// Server variables.
export const PORT = (process.env.PORT !== undefined) ? parseInt(process.env.PORT) : 3001;
const backend = {
  HOST: (process.env.HOST !== undefined) ? process.env.HOST : 'http://127.0.0.1:8080'
};
const app = express();

swagger(app);

// Server setup.
app.use(helmet());
app.use(express.json());

// Use routes.
routes(app, fetch, backend);

// Server activation.
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});