const mongoose = require("mongoose");

const torrentSchema = new mongoose.Schema({
  filePath: String,
  title: String,
  tags: String,
  files: [String],
  size: String,
  url: String
});

module.exports = mongoose.model("torrent", torrentSchema);

