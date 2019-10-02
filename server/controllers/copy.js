const logger = require('../../logger')(module.filename);
const mongoose = require('mongoose');
const { exec } = require('child_process');
const fs = require('fs');
const { 
  basenameWitoutExtention, 
  getAllFiles,
  filterFileListByPath,
  copyFiles
} = require('../utils-local');

const Torrent = mongoose.model('torrent');
const Metadata = mongoose.model('metadata');
const Video = mongoose.model('video');

const { 
  TORRENTS_PATH,
  VIDEOS_PATH, 
  DOWNLOADS_PATH,
  FILE_TYPES,
  RENAME_FILE,
  NORMALIZE_FILENAME_PATTERNS,
  CLEAN_VIDEOS_COLLECTON,
  CONTACT_SHEETS_PATH,
  VENDOR_PATH,
  SINGLE_OP_MODE,
} = require('../config');

const path = require('path');
const util = require('util');
const { compose } = require('ramda');
var unique = require('array-unique');

module.exports = async (req, res, next) => {

  logger.info('\n============== COPY START =============\n');

  if(CLEAN_VIDEOS_COLLECTON) {
    const { deletedCount } = await Video.deleteMany({}).catch(next);
    if(deletedCount === undefined) {
      logger.error(`Error occured while deleting video documents from videos collection`);
      return;
    }
    logger.info(`Deleted ${deletedCount} documents from Videos collection`);
  }

  let files = await Torrent.find({}, 'files').catch(err => {
    logger.error(`Error occured while getting files from db
    ${err}`);
    res.status(500)
    return res.end();
  });

  if(!files) {
    logger.error(`No torrent documents received from Torrents collection`);
    res.status(500)
    return res.end();
  };

  files = compose(setSrcAbsPath, filterByType, flattenSearchResult)(files);
  logger.debug(`\n${ util.inspect( files ) }\n`);
  logger.debug(`${files.length} videos found in recorded in torrent files`);
  logger.info(`------------------------------------------------------\n`);


  files = await filterFileListByPath(files, 'src');
  files = await createDestPath(files);
  logger.debug(`\n${ util.inspect( files ) }\n`);
  logger.info(`${files.length} documents remains after filtering files with zero size`);
  logger.info(`------------------------------------------------------\n`);


  files = await copyFiles(files);

  files = await filterFileListByPath(files, 'dest');
  logger.debug(`\n${ util.inspect(files) }\n`);
  logger.info(`${files.length} were actually copied`);
  logger.info(`------------------------------------------------------\n`);

  files = await saveFilesToDatabase(files);


  logger.info('\n============== COPY END  =============\n');

  //Proceed to the next operation
  logger.info('SINGLE_OP_MODE: ' + SINGLE_OP_MODE);

  if(SINGLE_OP_MODE) {
    res.redirect('/copied-files');
  } else {
    next();
  }
}


function setSrcAbsPath(files) {
  let newFiles = [...files];
  newFiles = newFiles.map(file => 
    ({...file, src: path.join(DOWNLOADS_PATH, file.src)}));
  return newFiles;
}


function saveFilesToDatabase(files) {
  return Promise.all(files.map(saveFileToDatabase));
}


function saveFileToDatabase(file) {
  const {id, dest} = file;

  logger.info(`Saving to database: \n${dest}`)

  const video = new Video({
    torrentId: id, 
    path: dest, 
    filename: path.basename(dest)
  }); 

  return video.save().then(result => {
    logger.info(`Saved to database: \n${result}`);
    return result;
  }).catch(logger.error);

}


function flattenSearchResult(result) {
  return result.reduce((acc, val) => {
    const temp = val.files.map(file => ({id: val._id, src: file}))
    return acc.concat(temp);
  }, []);
}


function filterByType(files) {
  return files.filter(file => {
    const ext = path.extname(file.src)
      .substring(1)
      .toLowerCase();
    const result = !FILE_TYPES.includes(ext);
    return result;
  });  
}


function createDestPath(files) {
  const resolvedFiles = files.map(async ( file, counter ) => {
    let fileName = path.basename(file.src);
    const newFileName = await rename(fileName, file.id, counter);
    const dest = path.join(VIDEOS_PATH, newFileName);

    return new Promise(resolve => {
      resolve({id: file.id, src: file.src, dest});
    });
  });  

  return Promise.all(resolvedFiles);
}


async function rename(fileName, id, counter) {
  const title = await getTorrentTitleByID(id);
  let newTitle= normalizeFilename(title);

  let newFileName = basenameWitoutExtention(fileName);

  newFileName = normalizeFilename(newFileName);

  const resultName = [].concat(
    newTitle.split('-').slice(0, 3),
    newFileName.split('-').slice(0, 3),
    counter
  ).join('-')
    .concat(path.extname(fileName));

  return new Promise(resolve => resolve(resultName));
}


function normalizeFilename(name) {
  NORMALIZE_FILENAME_PATTERNS.forEach(({regex, replacement}) => {
    name = name.replace(regex, replacement);
  });
  return name;
}

function getTorrentTitleByID(id) {
  return new Promise((resolve, reject) => {
    Torrent.findById(id)
      .select('title')
      .exec((err, res) => {
        if(err) {
          logger.error(`Error searching torrent id: ${id}`);
          logger.error(err);
          reject(err);
        }
        resolve(res.title);
      });
  });
}

