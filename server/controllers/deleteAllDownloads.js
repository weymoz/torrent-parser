const { Torrent } = require("../db");
const logger = require('../../logger')(module.filename);
const fs = require('fs');
const del = require('del');
const { DOWNLOADS_PATH } = require('../config');


module.exports = async (req, res) => {
  logger.info(`Deleting all downloads...`);
  const deletedPaths = await del([`${DOWNLOADS_PATH}/**/*`]);
  logger.info(`List of deleted files and dirs: ${deletedPaths.join('\n')}`);
  res
    .redirect(302, 
      `/admin?id=${Math.floor(Math.random() * 1000)}${Date.now()}`);
}
