const fs = require("fs");
const parseTorrent = require("parse-torrent");
const { get, post } = require("../client");
const { SERVER_URL, SERVER_PORT } = require("../config");

(async () => {

  const torrents = await get(`${SERVER_URL}:${SERVER_PORT}/get-all-torrents`);
  
  for (let torrent of torrents) {
    fs.readFile(torrent.filePath, (err, torrentBuffer) => {
    
    const files = 
      parseTorrent(torrentBuffer).files.map(file => file.path);

      post(`${SERVER_URL}:${SERVER_PORT}/save-files`, {_id: torrent._id, files});
    });
  }



})();
