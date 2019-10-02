const path = require('path');

const devConfig =  
{
  CONFIG_MODE: 'development',

  CLEAN_ALL_FOLDERS: false, //!!!

    CLEAN_SCREENSHOTS: true,
    CLEAN_CONTACTSHEETS: true,
    CLEAN_VIDEOS: true,
    CLEAN_DOWNLOADS: false,
    CLEAN_TORRENTS: false,

    SINGLE_OP_MODE: process.env.SINGLE_OP_MODE !== 'false' && false,

  //DATABASE_URL: process.env.DATABASE_URL || "mongodb://localhost/parser",
   DATABASE_URL: process.env.DATABASE_URL || "mongodb://dev:qxwv_35AZSC@176.9.155.242:27017/parser",

    DROP_DATABASE: process.env.DROP_DATABASE !== "false" && false,

    CLEAN_VIDEOS_COLLECTON: process.env.CLEAN_VIDEOS_COLLECTON !== 
      "false" && true,

    SERVER_PORT: process.env.SERVER_PORT || 3000,

    TORRENTS_PATH: process.env.TORRENTS_PATH 
  //  || "/home/mint/hetz/home/alul/rtorrent/watch/bposter",
  || "/home/mint/projects/parser/torrents",

    DOWNLOADS_PATH: process.env.DOWNLOADS_PATH 
  //  || "/home/mint/hetz/home/alul/rtorrent/download/bposter",
  || "/home/mint/projects/parser/downloads",

    VIDEOS_PATH: process.env.VIDEOS_PATH 
    //|| "/home/mint/hetz/home/alul/bposter/videos",
    || "/home/mint/projects/parser/videos",

    LINKS_PATH: process.env.LINKS_PATH 
    || "/home/mint/projects/parser/links/filehoster.txt",

    DOCS_PATH: path.join(__dirname, '..', 'out'),

    CONTACT_SHEETS_PATH: '/home/mint/projects/parser/contactsheets',

    SCREENSHOTS_PATH: '/home/mint/projects/parser/screenshots',

    VENDOR_PATH: '/home/mint/projects/parser/vendor',

    ARCHIVES_PATH: '/home/mint/projects/parser/archives',

    ARCHIVE_TRESHOLD: 140000000, //bytes

    ARCHIVE_VOLUME_SIZE: 100000000, //bytes

    FILE_TYPES: [
      'jpg',
      'jpeg',
      'gif',
      'tiff',
      'png',
      'bmp',
      'zip',
      'rar',
      'tar',
      'gz'
    ],

    RENAME_FILE: process.env.RENAME_FILE !== "false" && true,

    NORMALIZE_FILENAME_PATTERNS: [
      {
        regex: /\s/gi,
        replacement: '-'
      },
      {
        regex: /\[/gi,
        replacement: ''
      },
      {
        regex: /]/gi,
        replacement: ''
      },
      {
        regex: /\(/gi,
        replacement: ''
      },
      {
        regex: /\)/gi,
        replacement: ''
      },
      {
        regex: /REQ/g,
        replacement: ''
      },
      {
        regex: /clips?/gi,
        replacement: ''
      },
      {
        regex: /images?/gi,
        replacement: ''
      },
      {
        regex: /&/g,
        replacement: ''
      },
      {
        regex: /\d+/g,
        replacement: ''
      },
      {
        regex: /\//g,
        replacement: ''
      },
      {
        regex: /-@.+-/gi,
        replacement: '-'
      },
      {
        regex: /\.+/g,
        replacement: '.'
      },
      {
        regex: /-+/g,
        replacement: '-'
      },
      {
        regex: /^-/g,
        replacement: ''
      },
      {
        regex: /-$/g,
        replacement: ''
      },
    ],

}; 

const prodConfig = {
  CONFIG_MODE: 'production',

  DROP_DATABASE: process.env.DROP_DATABASE !== "false" && false,

  SINGLE_OP_MODE: process.env.SINGLE_OP_MODE !== 'false' && true,

  TORRENTS_PATH: process.env.TORRENTS_PATH 
  || '/home/alul/rtorrent/watch/bposter',

  DOWNLOADS_PATH: process.env.DOWNLOADS_PATH 
  || '/home/alul/rtorrent/download/bposter',

  VIDEOS_PATH: process.env.VIDEOS_PATH 
  || path.join(__dirname, '..', 'videos'),

  LINKS_PATH: process.env.LINKS_PATH 
  || path.join(__dirname, '..', 'links', 'filehoster.txt'),

  CONTACT_SHEETS_PATH: path.join(__dirname, '..', 'contactsheets'),

  SCREENSHOTS_PATH: path.join(__dirname, '..', 'screenshots'),

  VENDOR_PATH: path.join(__dirname, '..', 'vendor'), 

  ARCHIVES_PATH: path.join(__dirname, '..', 'archives'),

};

console.log(process.env.MODE);
const mode = process.env.MODE === 'production' ? 'production' : 'development';
console.log(mode);

const config = (mode === 'development') ? devConfig : Object.assign(devConfig, prodConfig);

module.exports = config;
