const winston = require("winston");

module.exports = winston.createLogger({
  level: "info",
  format: winston.format.prettyPrint(),
  transports: [
    new winston.transports.Console()
  ]
});
