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
  let videos = await Video
    .find({screenshotsPath: {$ne: null}})
    .select('screenshotsPath');

  videos = await uploadImages(videos);

  const results = await saveImagesToDatabase(videos);
  logger.info(results)

  logger.info('\n============== UPLOAD SCREENSHOTS END =============\n');

  if(SINGLE_OP_MODE) {
    res.redirect('/copied-files');
  } else {
    next();
  }
  
}

function uploadImages(videos) {
  return Promise.all(videos.map(uploadVideoScreenshots));
}


function uploadVideoScreenshots(video) {
  const {screenshotsPath: paths, _id: id} = video;
  return new Promise(async resolve => {
    const results = await Promise.all(paths.map(path => uploadImage(path)));

    const screenshotsUrl = results.map(result => ( {
      screenshotThumbUrl: result.th_url, 
      screenshotImgUrl: result.show_url
    } )); 
    resolve( {id, screenshotsUrl} );
  })
}


function uploadImage(screenshotPath) {
  return new Promise(resolve => {
    options.formData.img =  fs.createReadStream(screenshotPath);
    request(options, (err, resp, body) => {
      if(err) {
        logger.error('Failed to uppload screenshot');
        logger.error(util.inspect(err));
        resolve({})
      }
      const jsonBody = JSON.parse(body);
      logger.info(`Uploaded successfully ${util.inspect(jsonBody)}`);
      resolve(jsonBody);
    });
  })
}


function saveImagesToDatabase(videos) {
  return Promise.all(videos.map(saveImageToDatabase));
}


function saveImageToDatabase(video) {
  return new Promise(resolve => {
    Video.findByIdAndUpdate(video.id, {
      screenshotsUrl: video.screenshotsUrl
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

