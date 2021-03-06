import logger from './../../logger.js';
import fetch from 'node-fetch';
import { getHeaders } from '../../utils.js';
import { itemsListDb } from '../../db.js';
import { CACHE_TIME } from '../../server.js';

/**
 * Items backend namespace. Providing access to the openHAB backend.
 *
 * @namespace itemsBackend
 */

/**
 * Sends a command to an Item.
 *
 * @memberof itemsBackend
 * @param {String} HOST hostname of openHAB server
 * @param {*} expressReq request object from expressjs
 * @param {String} itemname Item name
 * @param {String} command valid item command (e.g. ON, OFF, UP, DOWN, REFRESH)
 * @returns {Integer} Response code from backend
 */
export const sendItemCommand = async function (HOST, expressReq, itemname, command) {
  const headers = await getHeaders(expressReq);
  try {
    const status = await (await fetch(HOST + '/rest/items/' + itemname, { headers: headers, method: 'POST', body: command })).status;
    logger.debug(`sendItemCommand(): Sent command ${command} to ${HOST + '/rest/items/' + itemname}, HTTP response code ${status}`);
    return status;
  } catch (err) {
    const error = new Error(`sendItemCommand(): An error occurred while sending command to ${HOST + '/rest/items/' + itemname}: ${err}`);
    logger.error(error);
    error();
  }
};

/**
 * Gets the state of an Item.
 *
 * @memberof itemsBackend
 * @param {String} HOST hostname of openHAB server
 * @param {*} expressReq request object from expressjs
 * @param {String} itemname Item name
 * @returns {Object} Object: { state: Item state, status: HTTP status code }
 */
export const getItemState = async function (HOST, expressReq, itemname) {
  const headers = await getHeaders(expressReq);
  try {
    const response = await fetch(HOST + '/rest/items/' + itemname + '/state', { headers: headers });
    const state = await response.text();
    const status = response.status;
    logger.debug(`getItemState(): Got state ${state} from ${HOST + '/rest/items/' + itemname + '/state'}, HTTP response code ${status}`);
    return {
      state: state,
      status: status
    };
  } catch (err) {
    const error = new Error(`getItemState(): An error occurred while getting state from ${HOST + '/rest/items/' + itemname + '/state'}: ${err}`);
    logger.error(error);
    error();
  }
};

/**
 * Gets a single Item.
 *
 * @memberof itemsBackend
 * @param {String} HOST hostname of openHAB server
 * @param {*} expressReq request object from expressjs
 * @param {String} itemname Item name
 * @returns {Object} Object: { json: JSON reponse, status: HTTP status code }
 */
export const getItem = async function (HOST, expressReq, itemname) {
  const headers = await getHeaders(expressReq);
  try {
    const response = await fetch(HOST + '/rest/items/' + itemname, { headers: headers });
    const json = await response.json();
    const status = response.status;
    logger.debug(`getItem(): Got Item ${itemname} from ${HOST + '/rest/items/' + itemname}, HTTP response code ${status}`);
    return {
      json: json,
      status: status
    };
  } catch (err) {
    const error = new Error(`getItem(): An error occurred while getting Item from ${HOST + '/rest/items/' + itemname}: ${err}`);
    logger.error(error);
    error();
  }
};

/**
 * Gets all Items.
 *
 * @memberof itemsBackend
 * @param {String} HOST hostname of openHAB server
 * @param {*} expressReq request object from expressjs
 * @returns {Object} Object: { json: JSON reponse, status: HTTP status code }
 */
export const getAllItems = async function (HOST, expressReq) {
  const now = Date.now();
  const itemsList = itemsListDb.findOne({ name: 'list' });
  if (itemsList) {
    if (now < itemsList.lastupdate + CACHE_TIME) {
      // Currently stored version not older than CACHE_TIME.
      logger.debug('getAllItems(): Found in database and not older than 2 min.');
      return itemsList.json;
    }
    itemsListDb.findAndRemove({ name: 'list' });
  }

  const headers = await getHeaders(expressReq);
  try {
    const response = await fetch(HOST + '/rest/items', { headers: headers });
    const json = await response.json();
    itemsListDb.insert({ name: 'list', lastupdate: now, json: json });
    const status = response.status;
    logger.debug(`getAllItems(): Successfully requested backend ${HOST + '/rest/items'}, HTTP response code ${status}`);
    return json;
  } catch (err) {
    const error = new Error(`getAllItems(): An error occurred while getting all Items from ${HOST + '/rest/items'}: ${err}`);
    logger.error(error);
    error();
  }
};
