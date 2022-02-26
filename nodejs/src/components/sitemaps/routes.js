import { getAllSitemapsFiltered, getSitemap } from './backend.js';
import { requireHeader } from './../middleware.js';
import { backendInfo } from '../../server.js';

/**
 * Provides required /sitemaps routes.
 *
 * @memberof routes
 * @param {*} app expressjs app
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
   *         description: Name of user
   *         schema:
   *           type: string
   *         style: form
   *       - in: header
   *         name: X-OPENHAB-ORG
   *         required: false
   *         description: Organisations the user is member of
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
    const org = req.headers['x-openhab-org'] || [];
    const user = req.headers['x-openhab-user'];

    try {
      const data = await getAllSitemapsFiltered(backendInfo.HOST, req, user, org);
      res.status(200).send(data);
    } catch {
      res.status(500).send();
    }
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
   *         description: Sitemap name
   *         schema:
   *           type: string
   *         style: form
   *       - in: header
   *         name: X-OPENHAB-USER
   *         required: true
   *         description: Name of user
   *         schema:
   *           type: string
   *         style: form
   *       - in: header
   *         name: X-OPENHAB-ORG
   *         required: false
   *         description: Organisations the user is member of
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
  app.get('/rest/sitemaps/:sitemapname', requireHeader('X-OPENHAB-USER'), async (req, res) => {
    const org = req.headers['x-openhab-org'] || [];
    const user = req.headers['x-openhab-user'];

    if (req.params.sitemapname === user || org.includes(req.params.sitemapname)) {
      try {
        const json = await getSitemap(backendInfo.HOST, req, req.params.sitemapname);
        res.status(200).send(json);
      } catch {
        res.status(404).send();
      }
    } else {
      res.status(404).send();
    }
  });

  /**
   * @swagger
   * /rest/sitemaps/{sitemapname}/{pageid}:
   *   get:
   *     summary: Get sitemap by name.
   *     parameters:
   *       - in: path
   *         name: sitemapname
   *         required: true
   *         description: Sitemap name
   *         schema:
   *           type: string
   *         style: form
   *       - in: path
   *         name: pageid
   *         required: true
   *         description: page id
   *         schema:
   *           type: string
   *         style: form
   *       - in: header
   *         name: X-OPENHAB-USER
   *         required: true
   *         description: Name of user
   *         schema:
   *           type: string
   *         style: form
   *       - in: header
   *         name: X-OPENHAB-ORG
   *         required: false
   *         description: Organisations the user is member of
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
  app.get('/rest/sitemaps/:sitemapname/:pageid', requireHeader('X-OPENHAB-USER'), async (req, res) => {
    const org = req.headers['x-openhab-org'] || [];
    const user = req.headers['x-openhab-user'];

    if (req.params.sitemapname === user || org.includes(req.params.sitemapname)) {
      try {
        const json = await getSitemap(backendInfo.HOST, req, req.params.sitemapname + '/' + req.params.pageid);
        res.status(200).send(json);
      } catch {
        res.status(404).send();
      }
    } else {
      res.status(404).send();
    }
  });
};

export default sitemaps;
