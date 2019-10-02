const logger = require('../../logger')(module.filename);
const mongoose = require('mongoose');
const Video = mongoose.model('video');
const { exec } = require('child_process');
const { inspect } = require('util');
const { 
  SINGLE_OP_MODE, 
  ARCHIVES_PATH,
  ARCHIVE_TRESHOLD,
  ARCHIVE_VOLUME_SIZE,
  VIDEOS_PATH,
  VENDOR_PATH, 
} = require('../config');
const del = require('del');
const path = require('path');
const fs = require('fs');
const { basenameWitoutExtention, filterFileListByPath } = require('../utils-local');

module.exports = async (req, res, next) => {

  logger.info('\n============== ARCHIVES START  =============\n');

  let files = await Video.findAll().select('path');
  console.log(files);
  console.log(files.length);

  files = await filterFileListByPath(files, 'path')
  console.log(files);
  console.log(files.length);
  //return res.end();

  files = await createArchives(files);
  logger.debug(inspect(files));

  files = await getAllFiles(VIDEOS_PATH);
  logger.debug(inspect(files));
  
  res.end();
}


function getAllFiles(folder) {
  return new Promise(function(resolve, reject) {
    fs.readdir(folder, (err, files) => {
      if(err) return reject(err);
      resolve(files);
    });
  });
}

function deleteOldArchives() {
  return del([`${ARCHIVES_PATH}/*`], {force: true}).then(deletedFiles => {
    logger.info(`List of deleted contactsheets:\n${deletedFiles.join('\n')}`);
  }, err => logger.error(err));
}

function createArchives(files) {
  return Promise.all(files.map(createArchive));
}


function createArchive(file) {
  return new Promise((resolve, reject) => {
    const mtn = exec(
      `${VENDOR_PATH}/rar m -r- -m0 \
      -sm${ARCHIVE_TRESHOLD} \
      -v${ARCHIVE_VOLUME_SIZE}b -ximg -xinf -xrars \
      "${file.path}.archive" \
      "${file.path}"`,

      function (error, stdout, stderr) {
        if (error) {
          console.log(error.stack);
        }
        console.log('Child Process STDOUT: '+stdout);
        console.log('Child Process STDERR: '+stderr);
      }
    );

    mtn.on('exit', function (code) {
      console.log('Child process exited with exit code '+code);
      resolve({id: file._id});
    });
  });
}
