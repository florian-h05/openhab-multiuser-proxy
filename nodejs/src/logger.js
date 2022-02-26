import pino from 'pino';
import * as dotenv from 'dotenv';

dotenv.config();

export default pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label };
    }
  }
});
