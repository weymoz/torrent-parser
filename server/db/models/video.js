const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  torrentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Torrent'
  },
  path: String
});

module.exports = mongoose.model('video', videoSchema);
