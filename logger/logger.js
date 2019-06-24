const { LOG_LEVEL } = require("../config");
const { createLogger, format, transports } = require("winston");
const { combine, printf, colorize } = format;
const path = require("path");



function createModuleLogger(moduleName) {

  const myFormat = combine(
    colorize(),
    printf(({ level, message }) => `[${level}:${path.basename(moduleName)}] ${message}`)
  );

  return createLogger({
    level: LOG_LEVEL,
    format: myFormat,
    transports: [new transports.Console()]
  });
}

module.exports = createModuleLogger;
