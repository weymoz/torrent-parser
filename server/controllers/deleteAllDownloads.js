const logger = require('../../logger')(module.filename);
const fs = require('fs');
const del = require('del');
const { DOWNLOADS_PATH } = require('../config');


module.exports = async (req, res) => {
  logger.info(`Deleting all downloads...`);
  const deletedFiles = await del([`${DOWNLOADS_PATH}/**/*`], {force: true});
  logger.info(`List of deleted files and dirs:\n${deletedFiles.join('\n')}`);
  res.render('deleted-files', {deletedFiles})
}
