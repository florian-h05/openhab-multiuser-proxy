import logger from './../logger.js';

export const requireHeader = (header) => {
  return function (req, res, next) {
    if (!req.headers[header.toLowerCase()]) {
      res.status(400).send(`${header} is required!`);
      logger.warn(`${req.ip} did not sent the required header ${header}`);
      return;
    } else {
      for (const i in req.headers) {
        req.headers[i] = req.headers[i].replace(/( )|(-)/g, '_');
      }
    }
    next();
  };
};

/**
 * Replace all spaces and hyphens with underscores in headers.
 *
 * @param {Array<String>} headers headers to operate on
 */
export const replaceSpaceHyphenWithUnderscore = (headers) => {
  return function (req, res, next) {
    for (const i in headers) {
      req.headers[headers[i].toLowerCase()] = req.headers[headers[i].toLowerCase()].replace(/( )|(-)/g, '_');
    }
  };
};
