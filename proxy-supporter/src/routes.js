import sitemaps from './components/sitemaps/routes.js';
import items from './components/items/routes.js';

/**
 * Routes namespace. Providing routes.
 *
 * @namespace routes
 */

/**
 * Main router.
 *
 * @memberof routes
 * @param {*} app expressjs app
 */
export default (app) => {
  /**
   * @swagger
   * /:
   *   get:
   *     summary: Retrieve server information.
   *     responses:
   *       200:
   *         description: Server information.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  app.get('/', (req, res) => {
    res.send({
      name: 'openHAB Multiuser Proxy - Supporting Logic',
      description: process.env.npm_package_description,
      author: 'Florian Hotze',
      version: process.env.npm_package_version,
      license: 'GNU GPL-3.0'
    });
  });

  // Other routes
  sitemaps(app);
  items(app);
};
