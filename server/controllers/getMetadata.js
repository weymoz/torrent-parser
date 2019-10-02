const logger = require('../../logger')(module.filename);
const mongoose = require('mongoose');
const ffmpeg = require('fluent-ffmpeg');
const { inspect } = require('util');
const { getTime, formatBytes } = require('../utils-local');

const Video = mongoose.model('video');

const { SINGLE_OP_MODE } = require('../config');

module.exports = async (req, res, next) => {
  logger.info('\n============== METADATA START =============\n');

  let files = await Video.findAll();
  logger.debug('Got files from database');
  logger.debug(files);

  files = await Promise.all(files.map(getMetadata));
  logger.debug('Got metadata');
  logger.debug(inspect(files));

  files = await Promise.all(files.map(updateVideoInfo));
  logger.debug('Updated database');
  logger.debug(inspect(files));

  logger.info('\n============== METADATA END =============\n');

  if(SINGLE_OP_MODE) {
    res.redirect('/copied-files');
  } else {
    next();
  }
}

async function updateVideoInfo(file) {
  return Video.updateOne({_id: file.fileId},
    {metadata: file.metadata});
}

function getMetadata(file) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(file.path, (err, metadata) => {
      if(err) {
        resolve({
          fileId: file._id, 
          metadata: {}
        });
        return;
      }

      resolve({
        fileId: file._id, 
        metadata: extractVideoData(metadata)
      });
    });
  });
}


function extractVideoData(metadata) {
  const { width, height } = metadata.streams.filter(stream => 
    stream.codec_type === 'video')[0];
  let { duration, size, bit_rate: bitrate } = metadata.format;

  //Transform values format
  duration = getTime(duration);
  size = formatBytes(size);

  return {
    duration,
    size,
    bitrate,
    resolution: `${width}x${height}px`
  };
}
