// WARNING: Directly export all functions; DO NOT use export default = { key: function }
// This approach does not work.

import { backendInfo } from './server.js';

/**
 * Utils namespace. Providing utility functions.
 *
 * @namespace utils
 */

/**
 * Get the value of all occurences of a key from a nested object.
 *
 * @memberof utils
 * @param {Object} obj object
 * @param {String} key key to find in the object
 * @returns {Array} array of the values of all occurences of key
 */
export const findKeyInObj = function (obj, key) {
  const values = [];
  const iterator = (obj, key) => {
    for (const i in obj) {
      if (i === key) {
        values.push(obj[i]);
      }
      if (typeof obj[i] === 'object') {
        iterator(obj[i], key);
      }
    }
  };
  iterator(obj, key);
  return values;
};

/**
 * Set proxy headers for backend requests using node-fetch.
 * If header is not present, use defaults.
 *
 * @memberof utils
 * @param {*} expressReq request object from expressjs
 * @returns {Object} headers for node-fetch
 */
export const getHeaders = function (expressReq) {
  return {
    Host: expressReq.headers.host || backendInfo.HOST,
    'X-Real-IP': expressReq.headers['x-real-ip'] || backendInfo.HOST,
    'X-Forwarded-For': expressReq.headers['x-forwarded-for'] || backendInfo.HOST,
    'X-Forwarded-Proto': expressReq.headers['x-forwarded-proto'] || 'http',
    Connection: 'upgrade',
    Upgrade: expressReq.headers.Upgrade
  };
};
