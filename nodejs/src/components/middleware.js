import logger from './../logger.js';

/**
 * Middlewares namespace. Provides middlewares for expressjs.
 *
 * @namespace middlewares
 */

/**
 * Require header in request.
 *
 * @memberof middlewares
 * @param {String} header header name
 */
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

/**
 * Replace all spaces and hyphens with underscores in headers.
 *
 * @memberof middlewares
 * @param {Array<String>} headers names of headers to operate on
 */
export const replaceSpaceHyphenWithUnderscore = (headers) => {
  return function (req, res, next) {
    for (const i in headers) {
      if (req.headers[headers[i]]) req.headers[headers[i].toLowerCase()] = req.headers[headers[i].toLowerCase()].replace(/( )|(-)/g, '_');
    }
    next();
  };
};

/**
 * Formats header X-OPENHAB-ORG from String to Array<String>.
 * Must not be applied before {@link middlewares.replaceSpaceHyphenWithUnderscore}!
 *
 * @memberof middlewares
 */
export const formatOrgs = () => {
  return function (req, res, next) {
    if (req.headers['x-openhab-org']) {
      req.headers['x-openhab-org'] = req.headers['x-openhab-org'].split('.');
    }
    next();
  };
};
