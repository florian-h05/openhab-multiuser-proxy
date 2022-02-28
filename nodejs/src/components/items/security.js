import logger from './../../logger.js';
import { getAllSitemapsFiltered, getItemsOfSitemap } from '../sitemaps/backend.js';

/**
 * Items security namespace. Provides security checks for Item access.
 *
 * @namespace itemsSecurity
 */

/**
 * Get names of all Items allowed for a client.
 *
 * @memberof itemsSecurity
 * @private
 * @param {String} HOST hostname of openHAB server
 * @param {*} expressReq request object from expressjs
 * @param {String} user username
 * @param {Array<String>} org array of organizations the user is member
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
 * @param {Array<String>} org array of organizations the user is member
 * @param {String} itemname name of Item
 * @returns {Boolean} whether Item access is allowed or not
 */
export const itemAllowedForClient = async function (HOST, expressReq, user, org, itemname) {
  const items = await getItemsForUser(HOST, expressReq, user, org);
  const allowed = items.includes(itemname);
  logger.info({ user: user, orgs: org }, `itemAllowedForUser(): Item ${itemname} allowed: ${allowed}`);
  return allowed;
};
