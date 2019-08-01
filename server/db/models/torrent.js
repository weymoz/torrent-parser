const mongoose = require("mongoose");

const torrentSchema = new mongoose.Schema({
  id: Number,
  filePath: String,
  title: String,
  tags: String,
  files: [String]
});

module.exports = mongoose.model("torrent", torrentSchema);

