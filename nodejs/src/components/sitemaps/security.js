import logger from './../../logger.js';
import { ORG_SEPARATOR, ADMIN_OU } from '../../server.js';

/**
 * Items security namespace. Provides security checks for Item access.
 *
 * @namespace sitemapsSecurity
 */

/**
 * Check whether Sitemap access is allowed for client.
 * Must be used with await in async functions.
 *
 * @memberof sitemapsSecurity
 * @param {String} user username
 * @param {String|Array<String>} org organizations the client is member of
 * @param {String} sitemapname name of Sitemap
 * @returns {Boolean} whether Sitemap access is allowed or not
 */
export const sitemapAllowedForClient = (user, org, sitemapname) => {
  if (typeof org === 'string') org = org.toString().split('.');
  // If Sitemap name includes ORG_SEPARATOR, return string before ORG_SEPARATOR, else return Sitemap name.
  const orgOfSitemap = (sitemapname.includes(ORG_SEPARATOR)) ? sitemapname.split(ORG_SEPARATOR)[0] : sitemapname;
  logger.trace(`sitemapAllowedForClient(): Organization of Sitemap ${sitemapname} is ${orgOfSitemap}`);
  let allowed;
  if (sitemapname === user || org.includes(orgOfSitemap) || org.includes(ADMIN_OU)) {
    allowed = true;
  } else {
    allowed = false;
  }
  logger.info({ user: user, orgs: org }, `sitemapAllowedForClient(): Access to Sitemap/Page ${sitemapname} allowed: ${allowed} (typeof ${typeof allowed})`);
  return allowed;
};
