/**
 * Provides the routes.
 *
 * Copyright (c) 2021 Florian Hotze under MIT License
 */
import sitemaps from './sitemaps/routes.js';

export default (app, fetch, backend) => {
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
  sitemaps(app, fetch, backend);
};
