const mongoose = require('mongoose');

const metadataSchema = new mongoose.Schema({
  duration: String,
  bitrate: Number,
  size: String,
  resolution: String
});

const videoSchema = new mongoose.Schema({
  torrentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'torrent'
  },
  path: String,
  filename: String,
  metadata: metadataSchema,
  contactsheetPath: String,
  contactsheetImgUrl: String,
  contactsheetThumbUrl: String,
  screenshotPath: String,
  screenshotImgUrl: String,
  screenshotThumbUrl: String,
  filehostLinks: [String]
});

videoSchema.statics.findAll = function() {
  return this.find({});
}

videoSchema.statics.findAllAndPopulate = function() {
  return this.findAll()
    .populate({path: 'torrentId', select: 'title -_id'});
}

videoSchema.statics.clearContactsheets = function() {
  return this.updateMany({}, {contactsheetPath: null,
  contactsheetImgUrl: null, contactsheetThumbUrl: null});
}

videoSchema.statics.clearScreenshots = function() {
  return this.updateMany({}, {screenshotPath: null,
  screenshotImgUrl: null, screenshotThumbUrl: null});
}

module.exports.video = mongoose.model('video', videoSchema);
module.exports.metadata = mongoose.model('metadata', metadataSchema);
