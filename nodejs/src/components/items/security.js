import { findKeyInObj } from '../../utils.js';
import sitemaps from '../sitemaps/backend.js';

/**
 * Items security namespace. Provides security checks for Item access.
 *
 * @namespace itemsSecurity
 */

/**
 * Get names of all Items in Sitemap.
 *
 * @memberof itemsSecurity
 * @private
 * @param {String} HOST hostname of openHAB server
 * @param {*} sitemapname Sitemap name
 * @returns {Array<String>} names of all Items in Sitemap
 */
const getItemsOfSitemap = async function (HOST, sitemapname) {
  try {
    const sitemap = await sitemaps.getSingle(HOST, sitemapname);
    const items = findKeyInObj(sitemap.homepage.widgets, 'item').map(item => item.name);
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
 * @param {String} user username
 * @param {Array<String>} org array of organisations the user is member
 * @returns {Array<String>} names of Items allowed for client
 */
const getItemsForUser = async function (HOST, user, org) {
  const sitemapList = await (await sitemaps.getAllFiltered(HOST, user, org)).map(sitemap => sitemap.name);
  console.info(`Sitemaps for ${user}/${org}: ${sitemapList}`);
  const items = [];
  for (const i in sitemapList) {
    console.info(sitemapList[i]);
    items.push(...await getItemsOfSitemap(HOST, sitemapList[i]));
  }
  console.info(`Allowed Items for ${user}/${org}: ${items}`);
  return items;
};

/**
 * Check whether Item access is allowed for client.
 *
 * @memberof itemsSecurity
 * @param {String} HOST hostname of openHAB server
 * @param {String} user username
 * @param {Array<String>} org array of organisations the user is member
 * @param {String} itemname name of Item
 * @returns {Boolean} whether Item access is allowed or not
 */
const itemAllowedForUser = async function (HOST, user, org, itemname) {
  const items = await getItemsForUser(HOST, user, org);
  const allowed = items.includes(itemname);
  console.info(`Access to ${itemname} allowed for ${user}/${org}: ${allowed}`);
  return allowed;
};

export default {
  itemAllowedForUser: itemAllowedForUser
};
