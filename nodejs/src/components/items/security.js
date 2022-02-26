import logger from './../../logger.js';
import { findKeyInObj } from '../../utils.js';
import { getAllSitemapsFiltered, getSitemap } from '../sitemaps/backend.js';
import { sitemapsDb } from '../../db.js';

/**
 * Items security namespace. Provides security checks for Item access.
 *
 * @namespace itemsSecurity
 */

/**
 * Get names of all Items in Sitemap.
 * Utilising LokiJS to cache the Items for up to two minutes for better performance.
 *
 * @memberof itemsSecurity
 * @private
 * @param {String} HOST hostname of openHAB server
 * @param {*} expressReq request object from expressjs
 * @param {*} sitemapname Sitemap name
 * @returns {Array<String>} names of all Items in Sitemap
 */
const getItemsOfSitemap = async function (HOST, expressReq, sitemapname) {
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

/**
 * Get names of all Items allowed for a client.
 *
 * @memberof itemsSecurity
 * @private
 * @param {String} HOST hostname of openHAB server
 * @param {*} expressReq request object from expressjs
 * @param {String} user username
 * @param {Array<String>} org array of organisations the user is member
 * @returns {Array<String>} names of Items allowed for client
 */
const getItemsForUser = async function (HOST, expressReq, user, org) {
  const sitemapList = await (await getAllSitemapsFiltered(HOST, expressReq, user, org)).map(sitemap => sitemap.name);
  const items = [];
  for (const i in sitemapList) {
    items.push(...await getItemsOfSitemap(HOST, expressReq, sitemapList[i]));
  }
  logger.debug({ user: user, orgs: org }, `getItemsForUser(): Allowed Items: [${items}]`);
  return items;
};

/**
 * Check whether Item access is allowed for client.
 *
 * @memberof itemsSecurity
 * @param {String} HOST hostname of openHAB server
 * @param {*} expressReq request object from expressjs
 * @param {String} user username
 * @param {Array<String>} org array of organisations the user is member
 * @param {String} itemname name of Item
 * @returns {Boolean} whether Item access is allowed or not
 */
const itemAllowedForUser = async function (HOST, expressReq, user, org, itemname) {
  const items = await getItemsForUser(HOST, expressReq, user, org);
  const allowed = items.includes(itemname);
  logger.info({ user: user, orgs: org }, `itemAllowedForUser(): Item ${itemname} allowed: ${allowed}`);
  return allowed;
};

export default {
  itemAllowedForUser: itemAllowedForUser
};
