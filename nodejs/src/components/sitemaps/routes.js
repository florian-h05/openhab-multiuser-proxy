import backend from './backend.js';
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
  app.get('/rest/sitemaps', async (req, res) => {
    const org = req.headers['x-openhab-org'] || [];
    const user = req.headers['x-openhab-user'];

    try {
      const data = await backend.getAllFiltered(backendInfo.HOST, user, org);
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
  app.get('/rest/sitemaps/:sitemapname', async (req, res) => {
    const org = req.headers['x-openhab-org'] || [];
    const user = req.headers['x-openhab-user'];

    if (req.params.sitemapname === user || org.includes(req.params.sitemapname)) {
      try {
        const json = await backend.getSingle(backendInfo.HOST, req.params.sitemapname);
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
