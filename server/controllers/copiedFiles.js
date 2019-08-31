const logger = require('../../logger')(module.filename);
const Video = require('mongoose').model('video');


module.exports = async (req, res, next) => {
  const videos = await Video.find({})
    .populate('torrentId')
    .exec().catch(next);
  if(!videos) {
    logger.error(`No video documents have been found in Video collection`);
    return;
  }

  console.log(videos);
}
