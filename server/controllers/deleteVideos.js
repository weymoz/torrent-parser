const logger = require('../../logger')(module.filename);
const fs = require('fs');
const del = require('del');
const { VIDEOS_PATH } = require('../config');


module.exports = async (req, res) => {
  logger.info(`Deleting all videos...`);
  const deletedFiles = await del([`${VIDEOS_PATH}/*`], {force: true});
  logger.info(`List of deleted files and dirs:\n${deletedFiles.join('\n')}`);
  res.render('deleted-files', {deletedFiles})
}
