import logger from './../logger.js';

export const requireHeader = (header) => {
  return function (req, res, next) {
    if (!req.headers[header.toLowerCase()]) {
      res.status(400).send(`${header} is required!`);
      logger.warn(`${req.ip} did not sent the required header ${header}`);
      return;
    }
    next();
  };
};
