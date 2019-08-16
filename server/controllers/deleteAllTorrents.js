const { Torrent } = require("../db");
const logger = require('../../logger')(module.filename);
const fs = require('fs');
const { TORRENTS_PATH } = require('../config');
const del = require('del');

module.exports = async (req, res) => {
  logger.info(`Deleting all torrents`);

  const deletedFiles = await del([`${TORRENTS_PATH}/**/*`]);
  logger.info(`List of deleted files and dirs:\n${deletedFiles.join('\n')}`);
  // const torrents = await Torrent.find({});
  // torrents.forEach(torrent => {
  //   fs.unlink(torrent.filePath, err => {
  //     if(err) {
  //       logger.error(`Can't delete file ${torrent.filePath}`);
  //       return;
  //     }

  //     logger.info(`deleted ${torrent.filePath}`);
  //   })
  // });

  const result = await Torrent.deleteMany({});
  logger.info(`${result.deletedCount} torrents were deleted from database`);

  res
    .redirect(302, 
      `/admin?id=${Math.floor(Math.random() * 1000)}${Date.now()}`);

}
