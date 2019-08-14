const fs = require("fs");
const parseTorrent = require("parse-torrent");
const { Torrent } = require("../db");
const logger = require("../../logger")(module.filename);

module.exports = async function (req, res) {

  let torrents = req.body; 
  logger.info(`${torrents.length} torrents received`);

  const files = await Promise.all(
    torrents.map(torrent => getTorrentFiles(torrent)));

  torrents.forEach((torrent, index) => {
    torrent.files = files[index];
  });

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


function torrentsExist(torrents) {
  return torrents.reduce((acc, torrent) => (!!torrent) && acc , true);
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
