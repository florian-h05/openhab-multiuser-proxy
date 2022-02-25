export const backendError = (url, err, res) => {
  console.error(`An error occurred when requesting backend [${url}]: ${err}`);
  res.status(500).send('Internal Server Error');
};
