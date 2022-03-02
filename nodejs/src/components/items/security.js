import logger from './../../logger.js';
import { getAllSitemapsFiltered, getItemsOfSitemap } from '../sitemaps/backend.js';
import { ADMIN_OU } from '../../server.js';

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
 * @param {String|Array<String>} org organizations the client is member of
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
 * Must be used with await in async functions.
 *
 * @memberof itemsSecurity
 * @param {String} HOST hostname of openHAB server
 * @param {*} expressReq request object from expressjs
 * @param {String} user username
 * @param {String|Array<String>} org organizations the client is member of
 * @param {String} itemname name of Item
 * @returns {Boolean} whether Item access is allowed or not
 */
export const itemAllowedForClient = async function (HOST, expressReq, user, org, itemname) {
  if (typeof org === 'string') org = org.toString().split('.');
  if (org.includes(ADMIN_OU)) {
    const allowed = true;
    logger.info({ user: user, orgs: org }, `itemAllowedForClient(): Item ${itemname} allowed: ${allowed} (typeof ${typeof allowed})`);
    return allowed;
  }
  try {
    const items = await getItemsForUser(HOST, expressReq, user, org);
    const allowed = items.includes(itemname);
    logger.info({ user: user, orgs: org }, `itemAllowedForClient(): Item ${itemname} allowed: ${allowed} (typeof ${typeof allowed})`);
    return allowed;
  } catch (err) {
    logger.error(err);
    return false;
  }
};
