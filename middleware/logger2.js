function log2(req, res, next) {
  console.log("logger 2");
  next();
}

module.exports = log2;
