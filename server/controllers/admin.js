const Torrent = require('mongoose').model('torrent');

module.exports = async (req, res) => {
  let torrents = await Torrent.find({});
  res.render('admin', {torrents});
}


