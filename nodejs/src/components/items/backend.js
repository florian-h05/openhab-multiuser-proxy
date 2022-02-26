import logger from './../../logger.js';
import fetch from 'node-fetch';
import { getHeaders } from '../../utils.js';

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
export const sendCommand = async function (HOST, expressReq, itemname, command) {
  const headers = await getHeaders(expressReq);
  try {
    const status = await (await fetch(HOST + '/rest/items/' + itemname, { headers: headers, method: 'POST', body: command })).status;
    logger.debug(`sendCommand(): Sent command ${command} to ${HOST + '/rest/items/' + itemname}, HTTP code ${status}`);
    return await status;
  } catch (err) {
    const error = new Error(`sendCommand(): An error occurred when sending command to ${HOST + '/rest/items/' + itemname}: ${err}.`);
    logger.error(error);
    error();
  }
};
