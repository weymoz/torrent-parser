const logger = require('../../logger')(module.filename);
const mongoose = require('mongoose');
const Video = mongoose.model('video');
const { exec } = require('child_process');
const { inspect } = require('util');
const { 
  SINGLE_OP_MODE, 
  SCREENSHOTS_PATH,
  VENDOR_PATH, 
} = require('../config');
const del = require('del');
const path = require('path');
const { basenameWitoutExtention, filterFileListByPath } = require('../utils-local');

module.exports = async (req, res, next) => {

  logger.info('\n============== SCREENSHOT START  =============\n');

  const result = await Video.clearScreenshots();
  logger.debug(`${result.nModified} screenshots cleared from db`);

  const deletedFiles = await deleteOldScreenshots();
  logger.info(`${deletedFiles.length} screenshots were deleted from disk`);

  let files = await Video.findAll().select('path');
  files = await Promise.all(files.map(createScreenshot));
  files = await filterFileListByPath(files, 'screenshotPath');
  files = await saveScreenshotsToDatabse(files, 'screenshotPath');

  logger.info(inspect(files));
  logger.info(`${files.length} screenshots addaed to db`);

  logger.info('\n============== SCREENSHOT END =============\n');

  if(SINGLE_OP_MODE) {
    res.redirect('/copied-files');
  } else {
    next();
  }
}

function deleteOldScreenshots() {
  return del([`${SCREENSHOTS_PATH}/*`], {force: true});
}


function createScreenshot(file) {

  return new Promise((resolve, reject) => {
    const mtn = exec(
      `${VENDOR_PATH}/mtn -b 2 -i -t -c 1 -r 1 -o _s.jpg -O ${SCREENSHOTS_PATH} ${file.path}`,
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
      const screenshotFileName = basenameWitoutExtention(path.basename(file.path)) + '_s.jpg';
      const screenshotPath = `${SCREENSHOTS_PATH}/${screenshotFileName}`;

      resolve({id: file._id, screenshotPath});
    });
  });
}


function saveScreenshotsToDatabse(files) {
  return Promise.all(files.map(saveScreenshotToDatabase)); 
}


function saveScreenshotToDatabase(file) {
  return Video.findByIdAndUpdate(
    file.id, 
    {screenshotPath: file.screenshotPath}, 
    {new: true} 
  ); 
}
