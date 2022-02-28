import sitemaps from './sitemaps/routes.js';
import items from './items/routes.js';

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
      name: process.env.npm_package_name,
      description: 'Multi-User support for openHAB REST API with NGINX.',
      purpose: 'This NodeJS application provides filters and access control mechanisms.',
      author: 'Florian Hotze',
      version: process.env.npm_package_version,
      license: 'GNU GPL-3.0',
      links: [
        { type: 'swagger-doc', path: '/swagger/' },
        { type: 'rest-api', path: '/rest' }
      ]
    });
  });

  // Other routes
  sitemaps(app);
  items(app);
};
