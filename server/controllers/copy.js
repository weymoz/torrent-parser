const logger = require('../../logger')(module.filename);
module.exports = (req, res) => {
  logger.info('Start copying...');
  res.end();
}
