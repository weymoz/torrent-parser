const mongoose = require("mongoose");

const torrentSchema = new mongoose.Schema({
  filePath: String,
  title: String,
  tags: String,
  files: [String]
});

module.exports = mongoose.model("torrent", torrentSchema);

