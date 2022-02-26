import security from './security.js';
import { requireHeader } from './../middleware.js';
import { backendInfo } from '../../server.js';
import { sendCommand } from './backend.js';

/**
 * Provide required /items routes.
 *
 * @memberof routes
 * @param {*} app expressjs app
 */
const items = (app) => {
  /**
   * @swagger
   * /rest/items/{itemname}:
   *   post:
   *     summary: Sends a command to an Item.
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
   *     requestBody:
   *       description: valid item command (e.g. ON, OFF, UP, DOWN, REFRESH)
   *       required: true
   *       content:
   *         text/plain:
   *           schema:
   *             type: string
   *     responses:
   *       200:
   *         description: OK
   *       400:
   *         description: Item command null
   *       404:
   *         description: Item not found
   */
  app.post('/rest/items/:itemname', requireHeader('X-OPENHAB-USER'), async (req, res) => {
    const org = req.headers['x-openhab-org'] || [];
    const user = req.headers['x-openhab-user'];

    try {
      const allowed = await security.itemAllowedForUser(backendInfo.HOST, req, user, org, req.params.itemname);
      if (allowed) {
        const status = await sendCommand(backendInfo.HOST, req, req.params.itemname, req.body);
        res.status(status).send();
      } else {
        res.status(404).send();
      }
    } catch {
      res.status(500).send('Internal server error.');
    }
  });

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
  app.get('/rest/items/allowed/:itemname', requireHeader('X-OPENHAB-USER'), async (req, res) => {
    const org = req.headers['x-openhab-org'] || [];
    const user = req.headers['x-openhab-user'];

    try {
      const allowed = await security.itemAllowedForUser(backendInfo.HOST, req, user, org, req.params.itemname);
      (allowed) ? res.status(200).send('Allowed.') : res.status(403).send('Forbidden.');
    } catch {
      res.status(500).send('Internal server error.');
    }
  });
};

export default items;
