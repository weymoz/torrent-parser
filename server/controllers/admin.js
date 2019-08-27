const { Torrent } = require("../db");

module.exports = async (req, res) => {
  let torrents = await Torrent.find({});
  res.render('admin', {torrents});
}


