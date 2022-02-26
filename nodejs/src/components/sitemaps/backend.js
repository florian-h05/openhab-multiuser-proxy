import logger from './../../logger.js';
import fetch from 'node-fetch';
import { getHeaders } from '../../utils.js';
import { sitemapListDb } from '../../db.js';

/**
 * Sitemaps backend namespace. Providing access to the openHAB backend.
 *
 * @namespace sitemapsBackend
 */

/**
 * Get all available Sitemaps.
 * Utilising LokiJS to cache the Sitemap list for up to two minutes for better performance.
 *
 * @memberof sitemapsBackend
 * @private
 * @param {String} HOST hostname of openHAB server
 * @param {*} expressReq request object from expressjs
 * @returns {Array<Object>} array of Sitemaps
 */
export const getAllSitemaps = async function (HOST, expressReq) {
  const now = Date.now();
  const sitemapsList = sitemapListDb.findOne({ name: 'list' });
  if (sitemapsList) {
    if (now < sitemapsList.lastupdate + 120000) {
      // Currently stored version not older than 2 min.
      logger.debug('getAllSitemaps(): Found in database and not older than 2 min.');
      return sitemapsList.json;
    }
    sitemapListDb.findAndRemove({ name: 'list' });
  }

  const headers = await getHeaders(expressReq);
  try {
    const json = await (await fetch(HOST + '/rest/sitemaps', { headers: headers })).json();
    sitemapListDb.insert({ name: 'list', lastupdate: now, json: json });
    logger.debug(`getAllSitemaps(): Successfully requested backend ${HOST + '/rest/sitemaps'}`);
    return await json;
  } catch (err) {
    const error = new Error(`getAllSitemaps(): An error occurred while requesting backend ${HOST + '/rest/sitemaps'}: ${err}`);
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
export const getAllSitemapsFiltered = async function (HOST, expressReq, user, org) {
  if (!user) throw Error('Parameter user is required!');
  if (!org) org = [];
  try {
    const json = await getAllSitemaps(HOST, expressReq);
    const sitemaps = [];
    for (const i in json) {
      if (json[i].name === user || org.includes(json[i].name)) {
        sitemaps.push(json[i]);
      }
    }
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
export const getSitemap = async function (HOST, expressReq, sitemapname) {
  const headers = await getHeaders(expressReq);
  try {
    const json = await (await fetch(HOST + '/rest/sitemaps/' + sitemapname, { headers: headers })).json();
    logger.debug(`getSitemap(): Successfully requested backend ${HOST + '/rest/sitemaps/' + sitemapname}`);
    return await json;
  } catch (err) {
    const error = new Error(`getSitemap(): An error occurred when requesting backend ${HOST + '/rest/sitemaps/' + sitemapname}: ${err}`);
    logger.error(error);
    error();
  }
};
