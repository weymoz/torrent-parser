const logger = require('../../logger')(module.filename);
const fs = require('fs');
const del = require('del');
const { 
  CLEAN_ALL_FOLDERS,
  CLEAN_SCREENSHOTS,
  CLEAN_CONTACTSHEETS,
  CLEAN_VIDEOS,
  CLEAN_DOWNLOADS,
  CLEAN_TORRENTS,
  VIDEOS_PATH, 
  CONTACT_SHEETS_PATH, 
  DOWNLOADS_PATH,
  TORRENTS_PATH,
  SCREENSHOTS_PATH
} = require('../config');


module.exports = async (req, res, next) => {
  if(CLEAN_ALL_FOLDERS) {
    logger.info(`Deleting all videos, contact sheets, archives ...`);

    let deletedFiles = await del([
      `${TORRENTS_PATH}/*`, 
      `${DOWNLOADS_PATH}/*`, 
      `${VIDEOS_PATH}/*`, 
      `${CONTACT_SHEETS_PATH}/*`, 
      `${SCREENSHOTS_PATH}/*`
    ], {force: true});

    logger.info(`List of deleted files and dirs:\n${deletedFiles.join('\n')}`);
    return next();
  } else {

    if(CLEAN_SCREENSHOTS) {

      logger.info(`Deleting Screenshots ...`);

      deletedFiles = await del([
        `${SCREENSHOTS_PATH}/*`
      ], {force: true});

      logger.info(`List of deleted screenshots:\n${deletedFiles.join('\n')}`);
    }

    if(CLEAN_CONTACTSHEETS) {

      logger.info(`Deleting contactsheets ...`);

      deletedFiles = await del([
        `${CONTACT_SHEETS_PATH}/*`
      ], {force: true});

      logger.info(`List of deleted contactsheets:\n${deletedFiles.join('\n')}`);
    }

    if(CLEAN_VIDEOS) {

      logger.info(`Deleting videos ...`);

      deletedFiles = await del([
        `${VIDEOS_PATH}/*`
      ], {force: true});

      logger.info(`List of deleted videos:\n${deletedFiles.join('\n')}`);
    }

    if(CLEAN_DOWNLOADS) {

      logger.info(`Deleting videos ...`);

      deletedFiles = await del([
        `${DOWNLOADS_PATH}/*`
      ], {force: true});

      logger.info(`List of deleted downloads:\n${deletedFiles.join('\n')}`);
    }

    if(CLEAN_TORRENTS) {

      logger.info(`Deleting videos ...`);

      deletedFiles = await del([
        `${TORRENTS_PATH}/*`
      ], {force: true});

      logger.info(`List of deleted downloads:\n${deletedFiles.join('\n')}`);
    }
  }

  next();
}
