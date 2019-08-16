const { TORRENTS_PATH } = require('../config');
const fs = require("fs");
const path = require("path");
const parseTorrent = require("parse-torrent");
const { Torrent } = require("../db");
const logger = require("../../logger")(module.filename);

module.exports = async function (req, res) {

  let torrents = req.body; 

  if(!Array.isArray(torrents)) {
    res.send("No torrents saved");
    return;
  }

  logger.info(`${torrents.length} torrents received`);

  //Construct real torrent file path
  torrents.forEach(torrent => {
    torrent.filePath = getTorrentPath(TORRENTS_PATH, torrent);
  });

  //get filenames in torrent files
  let files = await Promise.all(
    torrents.map(torrent => getTorrentFiles(torrent)));

  //save filenames to torrent objects
  torrents.forEach((torrent, index) => {
    torrent.files = files[index];
  });

  //Insert torrent objects to db
  Torrent.insertMany(torrents, function(err) {
    if(err) {
      logger.error('Error occured while inserting new records:');
      logger.error(err);
      return;
    }

    logger.info(`${torrents.length} torrents were added to database`);
  });

  res.send(`${torrents.length}`);
}


function getTorrentPath(torrentsPath, torrent) {
  return `${torrentsPath}/${torrent.filePath.split('/').slice(-1)}`;
}


function getTorrentFiles(torrent) {
  return new Promise((resolve, reject) => {
    fs.readFile(torrent.filePath, (err, torrentBuffer) => {

      if(err) {
        resolve(["Torrent file does not exist!"]);
        return;
      }

      resolve(
        parseTorrent(torrentBuffer)
        .files
        .map(file => file.path));
    });
  })
}
