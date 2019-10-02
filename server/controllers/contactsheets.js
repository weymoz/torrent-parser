const logger = require('../../logger')(module.filename);
const mongoose = require('mongoose');
const Video = mongoose.model('video');
const { exec } = require('child_process');
const { promisify, inspect } = require('util');
const { 
  SINGLE_OP_MODE, 
  CONTACT_SHEETS_PATH,
  VENDOR_PATH, 
} = require('../config');
const del = require('del');
const path = require('path');
const { basenameWitoutExtention, filterFileListByPath } = require('../utils-local');
const fs = require('fs');
const stat = promisify(fs.stat);


module.exports = async (req, res, next) => {

  logger.info('\n============== CONTACTSHEETS START  =============\n');

  //Clear old contactsheets paths from db
  const result = await Video.clearContactsheets();
  logger.debug(`${result.nModified} contactsheet records were cleared from db`);

  //Delete old contactsheets files from disk
  if(SINGLE_OP_MODE) {
    const deleted = await del([`${CONTACT_SHEETS_PATH}/*`], {force: true});
    logger.info(`Deleted ${deleted.length} contactsheets`);
    logger.info(deleted.join('\n'));
  }

  let files = await Video.findAll().select('path');

  files = await Promise.all(files.map(createContactsheet));
  files = await filterFileListByPath(files, 'contactsheetPath');

  const results = await Promise.all(files.map(file => 
    Video.findByIdAndUpdate(file.id, 
      {contactsheetPath: file.contactsheetPath}, 
      {new: true} ))); 

  logger.info('\n============== CONTACTSHEETS END =============\n');

  if(SINGLE_OP_MODE) {
    res.redirect('/copied-files');
  } else {
    next();
  }
}


function createContactsheet(file) {
  logger.debug(`Creating contactsheet for file: ${file.path}`)
  return new Promise((resolve, reject) => {
    const mtn = exec(
      `${VENDOR_PATH}/mtn -b 2 -i -t -c 3 -r 12 -w 1024 -o _c.jpg -O ${CONTACT_SHEETS_PATH} ${file.path}`,
      function (error, stdout, stderr) {
        logger.info(`Processing result for file: ${file.path}`)
        if (error) {
          logger.error(error);
        }
        logger.info('\n--------------- STDOUT ------------------');
        console.log(stdout);
        logger.info('\n--------------- STDERR ------------------');
        console.log(stderr);
      }
    );

    mtn.on('exit', function (code) {
        logger.info('\n--------------- EXIT ------------------');
        console.log('mtn exited with code: ' + code);

      const contacsheetFileName = basenameWitoutExtention(path.basename(file.path)) + '_c.jpg';
      const contactsheetPath = `${CONTACT_SHEETS_PATH}/${contacsheetFileName}`;

      resolve({id: file._id, contactsheetPath});
    });
  });
}
