const logger = require('../../logger')(module.filename);
const ffmpeg = require('fluent-ffmpeg');

const { 
  VIDEOS_PATH, 
  DOWNLOADS_PATH,
  FILE_TYPES,
  RENAME_FILE,
  NORMALIZE_FILENAME_PATTERNS,
  CLEAN_VIDEOS_COLLECTON,
} = require('../config');

const fs = require('fs');
const path = require('path');
const { compose } = require('ramda');

module.exports = async (req, res, next) => {

  if(CLEAN_VIDEOS_COLLECTON) {
    const { deletedCount } = await Video.deleteMany({}).catch(next);
    if(deletedCount === undefined) {
      logger.error(`Error occured while deleting video documents from videos collection`);
      return;
    }
    logger.info(`Deleted ${deletedCount} documents from Videos collection`);
  }

  let files = await Torrent.find({}, 'files')
    .exec()
    .catch(next);

  if(!files) {
    logger.error(`No torrent documents received from Torrents collection`);
    return;
  };

  files = compose(filterByType, flattenSearchResult)(files);

  copyFiles(files);

  res.redirect(`/copied-files?filesCount=${files.length}`);
}


async function copyFiles(files) {
  files = await resolvePath(files);
  files.forEach(processFile);
} 


async function processFile(file) {

  //1
  logger.info(`1) Starting to copy file ${file.dest}`);
  file = await copyFile(file);
  logger.info(`2) copied file ${file.dest}`);

  //2
  logger.info(`3) Starting to get metadata: ${file.dest}`);
  const metadata = await getMetadata(file)
    .catch(err => {
      logger.error(`Error getting metadata: ${file.dest}`)
    });
  file = {...file, metadata};
  logger.info(`4) Got metadata: ${file.dest}`);

  //3
  saveFileToDatabase(file);
}



function getMetadata(file) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(file.dest, (err, metadata) => {
      if(err) {
        reject(err);
        return;
      }
      resolve(extractVideoData(metadata));
    });
  });
}


function extractVideoData(metadata) {
  const { width, height } = metadata.streams.filter(stream => 
    stream.codec_type === 'video')[0];
  const { duration, size, bit_rate: bitrate } = metadata.format;

  return {
    duration,
    size,
    bitrate,
    resolution: `${width}/${height}px`
  };
}


function copyFile(file) {
  return new Promise(function(resolve, reject) {
    const {src, dest} = file;

    const fileReadStream = fs.createReadStream(src);
    fileReadStream.on('error', reject);

    const fileWriteStream = fs.createWriteStream(dest);
    fileWriteStream.on('finish', resolve.bind(null, file));
    fileWriteStream.on('error', reject);

    fileReadStream.pipe(fileWriteStream);
  });
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



function saveFileToDatabase(file) {
    const {id, dest, metadata} = file;
    const video = new Video({torrentId: id, path: dest, 
    metadata: new Metadata({...metadata})}); 
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


function errorHandler(error) {
  logger.error(error.message);
  throw error;
}
