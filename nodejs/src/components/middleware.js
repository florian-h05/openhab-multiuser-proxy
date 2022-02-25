export const requireHeader = (header) => {
  return function (req, res, next) {
    if (!req.headers[header.toLowerCase()]) return next(res.status(400).send(`${header} is required!`));
    next();
  };
};
