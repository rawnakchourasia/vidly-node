function log1(req, res, next) {
  console.log("logger 1");
  next();
}

module.exports = log1;
