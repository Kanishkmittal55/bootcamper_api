// @ desc Logs request to

const logger = (req, res, next) => {
  req.hello = `You are trying to ${req.method}  from ${req.get("host")} ${
    req.originalUrl
  } ${req.params.id}`;
  console.log("Middleware ran");
  next();
};

module.exports = logger;
