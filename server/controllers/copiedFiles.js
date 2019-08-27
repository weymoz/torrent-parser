const {Torrent, Video } = require("../db");
const logger = require('../../logger')(module.filename);

module.exports = async (req, res) => {
  Video.find({})
    .exec((err, copiedFiles) => {
      res.render('copied-files', {copiedFiles, filesCount: req.query.filesCount} );
    }
  );
   
}
