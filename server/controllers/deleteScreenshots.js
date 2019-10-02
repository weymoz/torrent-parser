const logger = require('../../logger')(module.filename);
const fs = require('fs');
const del = require('del');
const { SCREENSHOTS_PATH } = require('../config');
const mongoose = require('mongoose');
const Video = mongoose.model('video');


module.exports = async (req, res) => {
  logger.info(`Deleting all videos...`);
  const deletedFiles = await del([`${SCREENSHOTS_PATH}/*`], {force: true});
  await Video.clearScreenshots();
  logger.info(`List of deleted screenshots:\n${deletedFiles.join('\n')}`);
  res.render('deleted-files', {deletedFiles})
}
