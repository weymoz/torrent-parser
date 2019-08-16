const { Torrent } = require("../db");

module.exports = async (req, res) => {
  let torrents = await Torrent.find({});
  console.log(torrents);
  res.render('admin', {torrents});
}


