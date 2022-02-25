import security from './security.js';
import { backendInfo } from '../../server.js';

/**
 * Provide required /items routes.
 *
 * @memberof routes
 * @param {*} app expressjs app
 */
const items = (app) => {
  /**
   * @swagger
   * /rest/items/allowed/{itemname}:
   *   get:
   *     summary: Whether Item access is allowed for client.
   *     description: For usage with NGINX auth_request.
   *     parameters:
   *       - in: path
   *         name: itemname
   *         required: true
   *         description: Item name
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
   *         description: Allowed
   *       403:
   *         description: Forbidden
   */
  app.get('/rest/items/allowed/:itemname', async (req, res) => {
    const org = req.headers['x-openhab-org'] || [];
    const user = req.headers['x-openhab-user'];

    try {
      const allowed = await security.itemAllowedForUser(backendInfo.HOST, user, org, req.params.itemname);
      (allowed) ? res.status(200).send('Allowed.') : res.status(403).send('Forbidden.');
    } catch {
      res.status(500).send('Internal server error.');
    }
  });
};

export default items;