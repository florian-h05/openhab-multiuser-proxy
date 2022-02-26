import logger from './../../logger.js';
import fetch from 'node-fetch';

/**
 * Sitemaps backend namespace. Providing access to the openHAB backend.
 *
 * @namespace sitemapsBackend
 */

/**
 * Get all available Sitemaps.
 *
 * @memberof sitemapsBackend
 * @private
 * @param {String} HOST hostname of openHAB server
 * @returns {Array<Object>} array of Sitemaps
 */
const getAll = async function (HOST) {
  try {
    const json = await (await fetch(HOST + '/rest/sitemaps')).json();
    logger.debug(`Successfully requested backend ${HOST + '/rest/sitemaps'}`);
    return await json;
  } catch (err) {
    const error = new Error(`An error occurred while requesting backend ${HOST + '/rest/sitemaps'}: ${err}.`);
    logger.error(error);
    error();
  }
};

/**
 * Get all available Sitemaps for a client.
 *
 * @memberof sitemapsBackend
 * @param {String} HOST hostname of openHAB server
 * @param {String} user username
 * @param {Array<String>} org array of organisations the user is member
 * @returns {Array<Object>} array of Sitemaps
 */
const getAllFiltered = async function (HOST, user, org) {
  if (!user) throw Error('Paramater user is required.');
  if (!org) org = [];
  try {
    const json = await getAll(HOST);
    const sitemaps = [];
    for (const i in json) {
      if (json[i].name === user || org.includes(json[i].name)) {
        sitemaps.push(json[i]);
      }
    }
    logger.trace({ user: user, orgs: org }, `Number of Sitemaps: ${sitemaps.length}`);
    return sitemaps;
  } catch (err) {
    throw Error(err);
  }
};

/**
 * Get Sitemap by name.
 *
 * @memberof sitemapsBackend
 * @param {String} HOST hostname of openHAB server
 * @param {String} sitemapname Sitemap name
 * @returns {Object} Sitemap
 */
const getSingle = async function (HOST, sitemapname) {
  try {
    const json = await (await fetch(HOST + '/rest/sitemaps/' + sitemapname)).json();
    logger.debug(`Successfully requested backend ${HOST + '/rest/sitemaps/' + sitemapname}`);
    return json;
  } catch (err) {
    const error = new Error(`An error occurred when requesting backend ${HOST + '/rest/sitemaps/' + sitemapname}: ${err}.`);
    logger.error(error);
    error();
  }
};

export default {
  getAll: getAll,
  getAllFiltered: getAllFiltered,
  getSingle: getSingle
};
