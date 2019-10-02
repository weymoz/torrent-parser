const logger = require('../../logger')(module.filename);
const mongoose = require('mongoose');
const Video = mongoose.model('video');
const { VIDEOS_PATH } = require('../config');
const fs = require('fs');

module.exports = async (req, res) => {

  const allFiles = await getAllFiles(VIDEOS_PATH);
  console.log(allFiles);

  const allDocs = await Video.find({}).select('filename');
  console.log(allDocs);
  console.log(allFiles.length, allDocs.length);

  res.send('update');
}

function getAllFiles(folder) {
  return new Promise(function(resolve, reject) {
    fs.readdir(folder, (err, files) => {
      if(err) return reject(err);
      resolve(files);
    });
  });
}
