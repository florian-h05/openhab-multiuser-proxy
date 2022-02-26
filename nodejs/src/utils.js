// WARNING: Directly export all functions; DO NOT use export default = { key: function }
// This approach does not work.

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
        return;
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
 * Headers for backend requests using node-fetch.
 *
 * @memberof utils
 * @param {*} expressReq request object from expressjs
 * @returns {Object} headers for node-fetch
 */
export const getHeaders = function (expressReq) {
  return {
    Host: expressReq.headers.host,
    'X-Real-IP': expressReq.headers['x-real-ip'],
    'X-Forwarded-For': expressReq.headers['x-forwarded-for'],
    'X-Forwarded-Proto': expressReq.headers['x-forwarded-proto'],
    Connection: 'upgrade',
    Upgrade: expressReq.headers.Upgrade
  };
};
