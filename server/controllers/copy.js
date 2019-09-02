const logger = require('../../logger')(module.filename);
const ffmpeg = require('fluent-ffmpeg');
const mongoose = require('mongoose');
const { exec } = require('child_process');
const fs = require('fs');

const Torrent = mongoose.model('torrent');
const Metadata = mongoose.model('metadata');
const Video = mongoose.model('video');

const { 
  VIDEOS_PATH, 
  DOWNLOADS_PATH,
  FILE_TYPES,
  RENAME_FILE,
  NORMALIZE_FILENAME_PATTERNS,
  CLEAN_VIDEOS_COLLECTON,
  CONTACT_SHEETS_PATH,
  VENDOR_PATH,
} = require('../config');

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

  let files = await Torrent.find({}, 'files').exec().catch(next);

  if(!files) {
    logger.error(`No torrent documents received from Torrents collection`);
    return;
  };

  files = compose(filterByType, flattenSearchResult)(files);

  files = await copyFiles(files);

  res.redirect(`/copied-files?filesCount=${files.length}`);
}


async function copyFiles(files) {
  files = await resolvePath(files);
  files = files.filter(file => fs.existsSync(file.src));

  files = files.map(file => {
    return new Promise((resolve) => {
      copyFile(file).then(file => {
        logger.info(`Copied file: ${file.dest}`)
      }).catch(err => logger.error(err));
    });
  })

  return Promise.all(files);
} 


//async function processFile(file) {
//
//  //0 Check if file exists
//  if(!fs.existsSync(file.src)) return;
//
//  //1 Copy file to new folder
//  logger.info(`[1.1] Starting to copy file ${file.dest}`);
//  file = await copyFile(file).catch(err => console.log(err));
//  if(!file) return;
//  logger.info(`[1.2] copied file ${file.dest}`);
//
//  //2 Get files metadata
//  logger.info(`[2.1] Starting to get metadata: ${file.dest}`);
//  const metadata = await getMetadata(file)
//    .catch(err => {
//      logger.error(`Error getting metadata: ${file.dest}`)
//    });
//  file = {...file, metadata};
//  logger.info(`[2.2] Got metadata: ${file.dest}`);
//
//  //4 Create files contactsheets
//  file = await createContactsheet(file);
//  
//  //5 Uppload contactsheet to imagehoster website
//  file = await upploadContactsheet(file);
//
//  //6 Save file to database
//  saveFileToDatabase(file);
//
//}


function upploadContactsheet(file) {
  const { contactsheetPath: src } = file;
 
}



async function createContactsheet(file) {
  return new Promise((resolve, reject) => {
    const { dest } = file;
    const mtn = exec(
      `${VENDOR_PATH}/mtn -b 2 -i -t -c 3 -r 12 -w 1024 -O ${CONTACT_SHEETS_PATH} ${dest}`,
      function (error, stdout, stderr) {
        if (error) {
          console.log(error.stack);
          return reject(error);
        }
        console.log('Child Process STDOUT: '+stdout);
        console.log('Child Process STDERR: '+stderr);
      }
    );

    mtn.on('exit', function (code) {
      console.log('Child process exited with exit code '+code);

      const contacsheetFileName = basenameWitoutExtention(path.basename(dest)) + '_s.jpg';
      file.contactsheetPath = `${CONTACT_SHEETS_PATH}/${contacsheetFileName}`;
      resolve(file);
    });
  });
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


function basenameWitoutExtention(filename) {
  return filename.split('.').slice(0, -1).join('.')
}


async function rename(fileName, id) {
  const title = await getTorrentTitleByID(id);
  let newTitle= normalizeFilename(title);

  let newFileName = basenameWitoutExtention(fileName);

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

    logger.info(`[3.1] Starting to save ${dest} to database`);

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
      logger.info(`[3.2] Saved ${result} to database`);
    });
}


function errorHandler(error) {
  logger.error(error.message);
  throw error;
}
