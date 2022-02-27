import { itemAllowedForUser } from './security.js';
import { requireHeader } from './../middleware.js';
import { backendInfo } from '../../server.js';
import { sendItemCommand, getItemState, getItem } from './backend.js';
import logger from '../../logger.js';

/**
 * Provide required /items routes.
 *
 * @memberof routes
 * @param {*} app expressjs app
 */
const items = (app) => {
  /**
   * @swagger
   * /auth/items:
   *   get:
   *     summary: Authorization endpoint for Item access.
   *     description: Used by NGINX auth_request.
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
   *       - in: header
   *         name: X-ORIGINAL-URI
   *         required: true
   *         description: Original request URI
   *         schema:
   *           type: string
   *         style: form
   *     responses:
   *       200:
   *         description: Allowed
   *       403:
   *         description: Forbidden
   */
  app.get('/auth/items', requireHeader('X-OPENHAB-USER'), requireHeader('X-ORIGINAL-URI'), async (req, res) => {
    const org = req.headers['x-openhab-org'] || [];
    const user = req.headers['x-openhab-user'];
    const itemname = req.headers['x-original-uri'].split('/')[3];

    try {
      const allowed = await itemAllowedForUser(backendInfo.HOST, req, user, org, itemname);
      if (allowed) {
        logger.info(`/auth/items: Access to Item ${itemname} allowed for ${user}/[${org}]`);
        res.status(200).send();
      } else {
        res.status(403).send();
      }
    } catch (err) {
      logger.error(err);
      res.status(500).send('Internal server error.');
    }
  });

  /**
   * @swagger
   * /rest/items/{itemname}:
   *   get:
   *     summary: Gets a single Item.
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
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *       404:
   *         description: Item not found
   */
  app.get('/rest/items/:itemname', requireHeader('X-OPENHAB-USER'), async (req, res) => {
    const org = req.headers['x-openhab-org'] || [];
    const user = req.headers['x-openhab-user'];

    try {
      const allowed = await itemAllowedForUser(backendInfo.HOST, req, user, org, req.params.itemname);
      if (allowed) {
        const response = await getItem(backendInfo.HOST, req, req.params.itemname);
        res.status(response.status).send(response.json);
      } else {
        res.status(404).send();
      }
    } catch {
      res.status(500).send('Internal server error.');
    }
  });

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
      const allowed = await itemAllowedForUser(backendInfo.HOST, req, user, org, req.params.itemname);
      if (allowed) {
        const status = await sendItemCommand(backendInfo.HOST, req, req.params.itemname, req.body);
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
   * /rest/items/{itemname}/state:
   *   get:
   *     summary: Gets the state of an Item.
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
   *         description: OK
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *       404:
   *         description: Item not found
   */
  app.get('/rest/items/:itemname/state', requireHeader('X-OPENHAB-USER'), async (req, res) => {
    const org = req.headers['x-openhab-org'] || [];
    const user = req.headers['x-openhab-user'];

    try {
      const allowed = await itemAllowedForUser(backendInfo.HOST, req, user, org, req.params.itemname);
      if (allowed) {
        const response = await getItemState(backendInfo.HOST, req, req.params.itemname);
        res.status(response.status).send(response.state);
      } else {
        res.status(404).send();
      }
    } catch {
      res.status(500).send('Internal server error.');
    }
  });
};

export default items;
