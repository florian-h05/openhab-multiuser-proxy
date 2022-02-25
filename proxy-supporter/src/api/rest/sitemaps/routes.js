const backendError = (url, err, res) => {
  console.error(`An error occurred when requesting backend [${url}]: ${err}`);
  res.status(500).send();
}

/**
 * Provides all Sitemap routes.
 */
const sitemaps = (app, fetch, backend) => {
  /**
   * @swagger
   * /rest/sitemaps:
   *   get:
   *     summary: Get all available sitemaps for the given user/org.
   *     parameters:
   *       - in: query
   *         name: user
   *         required: true
   *         description: Name of user.
   *         schema:
   *           type: string
   *         style: form
   *       - in: query
   *         name: org
   *         required: false
   *         description: Organisations the user is member of.
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
    const org = req.query.org || [];
    const user = req.query.user;
    const url = backend.HOST + '/rest/sitemaps';
    
    fetch(backend.HOST + '/rest/sitemaps')
      .then((res) => res.json()) // openHAB returns a JSON array of objects
      .then((json) => {
        for (let i in json) {
          if (json[i].name !== user && !org.includes(json[i].name)) json.splice(i, 1);
        }
        console.debug(`Received HTTP GET request from IP [${req.ip}] at [${req.url}]`);
        res.status(200).send(json);
      })
      .catch((err) => backendError(url, err, res));
  });
};

export default sitemaps;
