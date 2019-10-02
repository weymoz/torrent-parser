const logger = require('../../logger')(module.filename);
const mongoose = require('mongoose');
const Video = mongoose.model('video');
const request = require('request');
const fs = require('fs');
const util = require('util');

const { 
  SINGLE_OP_MODE,
} = require('../config');


const options = {
  url: 'https://api.pixhost.to/images',
  headers: {
    "Content-Type": "multipart/form-data; charset=utf-8",
    "Accept": "application/json"
  },
  method: 'POST',
  formData: { 
    img: null, 
    content_type: "1",
    max_th_size: "500"
  }
};

module.exports = async (req, res, next) =>  {

  logger.info('\n============== UPLOAD SCREENSHOTS START  =============\n');
  let videos = await Video.find({screenshotPath: {$ne: null}}).select('screenshotPath');
  videos = await uploadImages(videos);
  const results = await saveImagesToDatabase(videos);
  logger.info('\n============== UPLOAD SCREENSHOTS END =============\n');

  if(SINGLE_OP_MODE) {
    res.redirect('/copied-files');
  } else {
    next();
  }
  
}

function uploadImages(videos) {
  return Promise.all(videos.map(uploadImage));
}

function uploadImage(video) {
  return new Promise((resolve) => {
    options.formData.img =  fs.createReadStream(video.screenshotPath);
    request(options, (err, resp, body) => {
      if(err) {
        logger.error('Failed to uppload screenshot');
        logger.error(util.inspect(err));
        resolve({})
      }
      const jsonBody = JSON.parse(body);
      jsonBody.videoId = video._id;
      logger.info(`Uploaded successfully ${util.inspect(jsonBody)}`);
      resolve(jsonBody);
    });
  })
}

function saveImagesToDatabase(images) {
  return Promise.all(images.map(saveImageToDatabase));
}

function saveImageToDatabase(image) {
  return new Promise(resolve => {
    Video.findByIdAndUpdate(image.videoId, {
      screenshotImgUrl: image.show_url,
      screenshotThumbUrl: image.th_url
    }, {new: true}, (err, result) => {
      if(err) {
        logger.error(err);
        resolve({});
        return;
      }

      logger.info('Document successfully updated');
      logger.info(util.inspect(result));
      resolve(result);
    })
  })
}

