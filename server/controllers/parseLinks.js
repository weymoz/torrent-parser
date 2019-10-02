const logger = require('../../logger')(module.filename);
const mongoose = require('mongoose');
const { basenameWitoutExtention } = require('../utils-local');
const Video = mongoose.model('video');
const path = require('path');
const util = require('util');
const { 
  splitFileToArray, 
  lastItem,
  secondLastItem
} = require('../utils-local');

const { 
  SINGLE_OP_MODE,
  LINKS_PATH
} = require('../config');


module.exports = async (req, res, next) => {

  logger.info('\n============== PARSE LINKS START =============\n');

  //Get links from the file
  const links = await splitFileToArray(LINKS_PATH);

  //Get additional info about the links 
  let linksData = links.map(link => {
    const filename = path.basename(link);
    const isArchive = lastItem(filename.split('.')) === 'rar';
    
    let partNumber;
    if(isArchive) {
      partNumber = secondLastItem(filename.split('.')).slice(-1);
    }

    let videoFilename;
    if(isArchive) {
      videoFilename = filename.split('.').slice(0, -3).join('.');
    } else {
      videoFilename = filename;
    }

    return {
      link,
      filename,
      isArchive,
      partNumber,
      videoFilename
    };
  });


  // Rearrange links in hash map:
  // {filename1: [link1, link2, ...], filename2: link1i, ...}
  linksData = linksData.reduce((acc, val) => {
    if(acc[val.videoFilename]) {
      acc[val.videoFilename].push(val);
    } else {
      acc[val.videoFilename] = [];
      acc[val.videoFilename].push(val);
    }
    return acc;
  }, {});

  
  // Sort archive links for each video
  for (let filename in linksData) {
    linksData[filename].sort((a, b) => a.partNumber < b.partNumber ? -1 : 1);
  }

  for (let filename in linksData) {
    const filehostLinks = linksData[filename].map(linkData => linkData.link);
    const result = await Video.findOneAndUpdate({filename}, {filehostLinks});
    logger.info("---------------------");
    logger.info(result);
  }



  logger.info(util.inspect(linksData));
  logger.info('\n============== PARSE LINKS END =============\n');

  res.send('parse links');
}


