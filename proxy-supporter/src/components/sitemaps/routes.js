import fetch from 'node-fetch';
import { backendInfo } from './../../server.js';
import { requireHeader } from './../middleware.js';

/**
 * Provides all Sitemap routes.
 */
const sitemaps = (app) => {
  /**
   * @swagger
   * /rest/sitemaps:
   *   get:
   *     summary: Get all available sitemaps.
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
  app.get('/rest/sitemaps', requireHeader('X-OPENHAB-USER'), (req, res) => {
    const org = req.headers['x-openhab-org'] || [];
    const user = req.headers['x-openhab-user'];

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
      .catch((err) => {
        console.error(`An error occurred when requesting backend [${req.url}]: ${err}`);
        res.status(404).send();
      });
  });

  /**
   * @swagger
   * /rest/sitemaps/{sitemapname}:
   *   get:
   *     summary: Get sitemap by name.
   *     parameters:
   *       - in: path
   *         name: sitemapname
   *         required: true
   *         description: Sitemap name.
   *         schema:
   *           type: string
   *         style: form
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
   *               type: object
   */
  app.get('/rest/sitemaps/:sitemapname', requireHeader('X-OPENHAB-USER'), (req, res) => {
    const org = req.headers['x-openhab-org'] || [];
    const user = req.headers['x-openhab-user'];

    if (req.params.sitemapname === user || org.includes(req.params.sitemapname)) {
      fetch(backendInfo.HOST + '/rest/sitemaps/' + req.params.sitemapname)
        .then((res) => res.json())
        .then((json) => {
          console.debug(`Received HTTP GET request from IP [${req.ip}] at [${req.url}]`);
          res.status(200).send(json);
        })
        .catch((err) => {
          console.error(`An error occurred when requesting backend [${req.url}]: ${err}`);
          res.status(404).send();
        });
    } else {
      res.status(404).send();
    }
  });
};

export default sitemaps;
