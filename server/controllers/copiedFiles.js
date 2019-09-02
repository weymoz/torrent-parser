const logger = require('../../logger')(module.filename);
const Video = require('mongoose').model('video');

module.exports = async (req, res, next) => {
  let videos = await Video.find({})
    .populate({path: 'torrentId', select: 'title -_id'})
    .exec().catch(next);
  if(!videos) {
    logger.error(`No video documents have been found in Video collection`);
    return;
  }

  videos = videos.map(video => {
    const { title: torrentTitle } = video.torrentId;
    const { duration, size, bitrate, resolution } = video.metadata;
    const { path } = video;
    return { 
      path,
      torrentTitle,
      metadata: {
        duration,
        size,
        bitrate,
        resolution
      }
    };
  });

  res.render('copied-files', {copiedFiles: videos, 
    filesCount: req.query.filesCount});
}
