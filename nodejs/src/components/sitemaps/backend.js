import logger from './../../logger.js';
import fetch from 'node-fetch';
import { getHeaders } from '../../utils.js';

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
 * @param {*} expressReq request object from expressjs
 * @returns {Array<Object>} array of Sitemaps
 */
const getAll = async function (HOST, expressReq) {
  const headers = await getHeaders(expressReq);
  try {
    const json = await (await fetch(HOST + '/rest/sitemaps', { headers: headers })).json();
    logger.debug(`getAll(): Successfully requested backend ${HOST + '/rest/sitemaps'}`);
    return await json;
  } catch (err) {
    const error = new Error(`getAll(): An error occurred while requesting backend ${HOST + '/rest/sitemaps'}: ${err}.`);
    logger.error(error);
    error();
  }
};

/**
 * Get all available Sitemaps for a client.
 *
 * @memberof sitemapsBackend
 * @param {String} HOST hostname of openHAB server
 * @param {*} expressReq request object from expressjs
 * @param {String} user username
 * @param {Array<String>} org array of organisations the user is member
 * @returns {Array<Object>} array of Sitemaps
 */
const getAllFiltered = async function (HOST, expressReq, user, org) {
  if (!user) throw Error('Paramater user is required.');
  if (!org) org = [];
  try {
    const json = await getAll(HOST, expressReq);
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
 * @param {*} expressReq request object from expressjs
 * @param {String} sitemapname Sitemap name
 * @returns {Object} Sitemap
 */
const getSingle = async function (HOST, expressReq, sitemapname) {
  const headers = await getHeaders(expressReq);
  try {
    const json = await (await fetch(HOST + '/rest/sitemaps/' + sitemapname, { headers: headers })).json();
    logger.debug(`getSingle(): Successfully requested backend ${HOST + '/rest/sitemaps/' + sitemapname}`);
    return await json;
  } catch (err) {
    const error = new Error(`getSingle(): An error occurred when requesting backend ${HOST + '/rest/sitemaps/' + sitemapname}: ${err}.`);
    logger.error(error);
    error();
  }
};

export default {
  getAll: getAll,
  getAllFiltered: getAllFiltered,
  getSingle: getSingle
};
