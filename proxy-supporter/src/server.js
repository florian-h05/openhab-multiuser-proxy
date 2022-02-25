import * as dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import swagger from './components/swagger.js';
import routes from './routes.js';

dotenv.config();

// Server variables.
export const PORT = (process.env.PORT !== undefined) ? parseInt(process.env.PORT) : 3001;
export const backendInfo = {
  HOST: (process.env.HOST !== undefined) ? process.env.HOST : 'http://127.0.0.1:8080'
};
const app = express();

// Server setup.
app.use(helmet());
app.use(express.json());

// Use routes.
swagger(app);
routes(app);

// Server activation.
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
