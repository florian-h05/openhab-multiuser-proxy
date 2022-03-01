import logger from './../../logger.js';
import fetch from 'node-fetch';
import { getHeaders, findKeyInObj } from '../../utils.js';
import { sitemapsDb, sitemapListDb } from '../../db.js';
import { sitemapAllowedForClient } from './security.js';

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
 * @param {String|Array<String>} org organizations the client is member of
 * @returns {Array<Object>} array of Sitemaps
 */
export const getAllSitemapsFiltered = async function (HOST, expressReq, user, org) {
  if (!user) throw Error('Parameter user is required!');
  if (!org) org = [];
  try {
    const json = await getAllSitemaps(HOST, expressReq);
    const sitemaps = [];
    for (const i in json) {
      if (sitemapAllowedForClient(user, org, json[i].name)) {
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

/**
 * Get names of all Items in Sitemap.
 * Utilising LokiJS to cache the Items for up to two minutes for better performance.
 *
 * @memberof sitemapsBackend
 * @param {String} HOST hostname of openHAB server
 * @param {*} expressReq request object from expressjs
 * @param {*} sitemapname Sitemap name
 * @returns {Array<String>} names of all Items in Sitemap
 */
export const getItemsOfSitemap = async function (HOST, expressReq, sitemapname) {
  const now = Date.now();
  const itemsDb = sitemapsDb.findOne({ name: sitemapname });
  if (itemsDb) {
    if (now < itemsDb.lastupdate + 120000) {
      // Currently stored version not older than 2 min.
      logger.debug(`getItemsOfSitemap(): Items of Sitemap ${sitemapname} found in database and not older than 2 min.`);
      return itemsDb.items;
    }
    sitemapsDb.findAndRemove({ name: sitemapname });
  }

  try {
    const sitemap = await getSitemap(HOST, expressReq, sitemapname);
    const items = findKeyInObj(sitemap.homepage.widgets, 'item').map(item => item.name);
    sitemapsDb.insert({ name: sitemapname, lastupdate: now, items: items });
    logger.debug({ sitemap: sitemapname }, `getItemOfSitemap(): Items of Sitemap ${sitemapname} fetched from backend`);
    return items;
  } catch (err) {
    throw Error(err);
  }
};
