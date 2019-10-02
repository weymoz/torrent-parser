const logger = require('../../logger')(module.filename);
const fs = require('fs');
const del = require('del');
const { CONTACT_SHEETS_PATH } = require('../config');
const mongoose = require('mongoose');
const Video = mongoose.model('video');


module.exports = async (req, res) => {
  logger.info(`Deleting all contactsheets...`);
  const deletedFiles = await del([`${CONTACT_SHEETS_PATH}/*`], {force: true});

  await Video.clearContactsheets(); 

  logger.info(`List of deleted contactsheets:\n${deletedFiles.join('\n')}`);
  res.render('deleted-files', {deletedFiles})
}
