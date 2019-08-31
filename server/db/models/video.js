const mongoose = require('mongoose');

const metadataSchema = new mongoose.Schema({
  duration: Number,
  bitrate: Number,
  size: Number,
  resolution: String
});

const videoSchema = new mongoose.Schema({
  torrentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'torrent'
  },
  path: String,
  metadata: metadataSchema
});

module.exports.video = mongoose.model('video', videoSchema);
module.exports.metadata = mongoose.model('metadata', metadataSchema);
