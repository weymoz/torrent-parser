const { Torrent } = require("../db");
const logger = require("../../logger")(module.filename);

module.exports = function(req, res) {
  const { id2, filePath } = req.body;
  const { id1, title, tags } = req.app.get("title and tags");
  
  console.log(`${id1}
  ${id2}
  ${title}
  ${tags}`);
}
