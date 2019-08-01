const { Torrent } = require("../db");
const logger = require("../../logger")(module.filename);

module.exports = function(req, res) {
  const { id1, title, tags } = req.body;

  req.app.set("id1", {id1});

  const torrent = new Torrent({
    id: id1,
    title,
    tags
  });

  torrent.save();
}
