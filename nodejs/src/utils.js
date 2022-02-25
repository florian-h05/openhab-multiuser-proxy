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
