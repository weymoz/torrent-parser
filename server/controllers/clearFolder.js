const logger = require('../../logger')(module.filename);
const fs = require('fs');
const del = require('del');
const { VIDEOS_PATH, CONTACT_SHEETS_PATH } = require('../config');


module.exports = async (req, res, next) => {
  logger.info(`Deleting all videos, contact sheets, ...`);

  const deletedFiles = await del([`${VIDEOS_PATH}/*`, 
    `${CONTACT_SHEETS_PATH}/*`], {force: true});

  logger.info(`List of deleted files and dirs:\n${deletedFiles.join('\n')}`);
  next();
}
