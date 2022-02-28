import * as dotenv from 'dotenv';
import logger from './../../logger.js';

dotenv.config();

/**
 * Items security namespace. Provides security checks for Item access.
 *
 * @namespace sitemapsSecurity
 */

/**
 * Separates the organization name at beginning of Sitemap name from the full name.
 *
 * @memberof sitemapsSecurity
 */
const ORG_SEPARATOR = process.env.ORG_SEPARATOR || '_org_';

/**
 * Check whether Sitemap access is allowed for client.
 *
 * @memberof sitemapsSecurity
 * @param {String} user username
 * @param {Array<String>} org array of organizations the user is member
 * @param {String} sitemapname name of Sitemap
 * @returns {Boolean} whether Sitemap access is allowed or not
 */
export const sitemapAllowedForClient = (user, org, sitemapname) => {
  org = new Array(org);
  // If Sitemap name includes ORG_SEPARATOR, return string before ORG_SEPARATOR, else return Sitemap name.
  const orgOfSitemap = (sitemapname.includes(ORG_SEPARATOR)) ? sitemapname.split(ORG_SEPARATOR)[0] : sitemapname;
  logger.debug(`sitemapAllowedForUser(): Organization of Sitemapp ${sitemapname} is ${orgOfSitemap}`);
  if (sitemapname === user || org.includes(orgOfSitemap)) {
    logger.info(`sitemapAllowedForUser(): Access to Sitemapp ${sitemapname} allowed for ${user}/[${org}]`);
    return true;
  } else {
    logger.info(`sitemapAllowedForUser(): Access to Sitemapp ${sitemapname} forbidden for ${user}/[${org}]`);
    return false;
  }
};
