const { Torrent, Video } = require("../db");
const logger = require('../../logger')(module.filename);

const { 
  VIDEOS_PATH, 
  DOWNLOADS_PATH,
  FILE_TYPES,
  RENAME_FILE,
  NORMALIZE_FILENAME_PATTERNS,
} = require('../config');

const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {

  (async function() {
    const deleteResult = await Video.deleteMany();
    logger
      .debug(`Deleted ${deleteResult.deletedCount} documents from video table`);
  })();

  logger.info('Start copying...');

  Torrent.find({})
    .select("files")
    .exec((err, result) => {

      let files = flattenSearchResult(result);
      files = filterByType(files);
      copyFiles(files);
      res.redirect(`/copied-files?filesCount=${files.length}`);
    });
}


async function copyFiles(files) {
  files = await resolvePath(files);
  files.forEach(file => {
    copyFile(file, saveFileToDatabase);
  });
} 


function copyFile(file, cb) {
  const {src, dest} = file;
  const fileReadStream = fs.createReadStream(src);
  const fileWriteStream = fs.createWriteStream(dest);
  fileWriteStream.on('finish', cb.bind(null, file));
  fileReadStream.pipe(fileWriteStream);
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


function resolvePath(files) {
  const resolvedFiles = files.map(async file => {
    const src = path.join(DOWNLOADS_PATH, file.src);

    let fileName = path.basename(file.src);
    
    const newFileName = await rename(fileName, file.id);

    const dest = path.join(VIDEOS_PATH, newFileName);

    return new Promise(resolve => {
      resolve({id: file.id, src, dest});
    });
  });  

  return Promise.all(resolvedFiles);
}


async function rename(fileName, id) {
  const title = await getTorrentTitleByID(id);
  let newTitle= normalizeFilename(title);

  let newFileName = fileName.split('.')
    .slice(0, -1)
    .join('.');
  newFileName = normalizeFilename(newFileName);

  const resultName = [].concat(
    newTitle.split('-').slice(0, 3),
    newFileName.split('-').slice(0, 3)
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



  /*
function copyFile(file, cb) {
    const {src, dest} = file;
    fs.copyFile(src, dest, err => {
      if(err) {
        logger.error(`Error copying ${src}`);
        logger.error(err);
        logger.error(err.stack);
        return;
      }
      logger.info(`Copied ${src} to ${dest}`);
      cb(file)
    });
}
*/
function saveFileToDatabase(file) {
    const {id, dest} = file;
    const video = new Video({torrentId: id, path: dest}); 
    const ERR_MSG = `Error saving file ${dest} to database`;

    video.save((err, result) => {
      if(err) {
        logger.error(ERR_MSG);
        logger.error(err);
        logger.error(err.stack);
        throw new Error(ERR_MSG);
      }
      logger.info(`Saved ${result} to database`);
    });
}



