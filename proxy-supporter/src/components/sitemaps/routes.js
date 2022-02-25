import fetch from 'node-fetch';
import { backendInfo } from './../../server.js';
import { backendError } from './../http-error.js';
import { requireHeader } from './../middleware.js';

/**
 * Provides all Sitemap routes.
 */
const sitemaps = (app) => {
  /**
   * @swagger
   * /rest/sitemaps:
   *   get:
   *     summary: Get all available sitemaps for the given user/org.
   *     parameters:
   *       - in: header
   *         name: X-OPENHAB-USER
   *         required: true
   *         description: Name of user.
   *         schema:
   *           type: string
   *         style: form
   *       - in: header
   *         name: X-OPENHAB-ORG
   *         required: false
   *         description: Organisations the user is member of.
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         style: form
   *         explode: true
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   */
  app.get('/rest/sitemaps', requireHeader('X-OPENHAB-USER'), async (req, res) => {
    const org = await req.headers['x-openhab-org'] || [];
    const user = await req.headers['x-openhab-user'];
    const url = await backendInfo.HOST + '/rest/sitemaps';

    fetch(backendInfo.HOST + '/rest/sitemaps')
      .then((res) => res.json()) // openHAB returns a JSON array of objects
      .then((json) => {
        const sitemaps = [];
        for (const i in json) {
          if (json[i].name === user || org.includes(json[i].name)) {
            sitemaps.push(json[i]);
          }
        }
        console.debug(`Received HTTP GET request from IP [${req.ip}] at [${req.url}]`);
        res.status(200).send(sitemaps);
      })
      .catch((err) => backendError(url, err, res));
  });
};

export default sitemaps;
