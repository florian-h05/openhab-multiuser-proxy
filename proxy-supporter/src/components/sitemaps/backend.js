import fetch from 'node-fetch';

const getAll = async function (HOST) {
  try {
    const response = await fetch(HOST + '/rest/sitemaps');
    console.debug(`Successfully requested backend ${HOST + '/rest/sitemaps'}`);
    return await response.json();
  } catch (err) {
    const msg = `An error occurred when requesting backend ${HOST + '/sitemaps'}: ${err}.`;
    console.error(msg);
    throw Error(msg);
  }
};

const getAllFiltered = async function (HOST, user, org) {
  try {
    const json = await getAll(HOST);
    const sitemaps = [];
    for (const i in json) {
      if (json[i].name === user || org.includes(json[i].name)) {
        sitemaps.push(json[i]);
      }
    }
    return sitemaps;
  } catch (err) {
    throw Error(err);
  }
};

const getSingle = async function (HOST, sitemapname) {
  try {
    const response = await fetch(HOST + '/rest/sitemaps/' + sitemapname);
    console.debug(`Successfully requested backend ${HOST + '/rest/sitemaps/' + sitemapname}`);
    return await response.json();
  } catch (err) {
    const msg = `An error occurred when requesting backend ${HOST + '/sitemaps/' + sitemapname}: ${err}.`;
    console.error(msg);
    throw Error(msg);
  }
};

export default {
  getAll: getAll,
  getAllFiltered: getAllFiltered,
  getSingle: getSingle
};
