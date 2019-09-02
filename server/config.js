
module.exports = {
  DATABASE_URL: process.env.DATABASE_URL || "mongodb://localhost/parser",

  DROP_DATABASE: process.env.DROP_DATABASE !== "false" && false,

  CLEAN_VIDEOS_COLLECTON: process.env.CLEAN_VIDEOS_COLLECTON !== 
    "false" && true,

  SERVER_PORT: process.env.SERVER_PORT || 3000,

  TORRENTS_PATH: process.env.TORRENTS_PATH 
  //|| "/home/mint/hetz/home/alul/rtorrent/watch/bposter",
  || "/home/mint/projects/parser/torrents",

  DOWNLOADS_PATH: process.env.DOWNLOADS_PATH 
  //|| "/home/mint/hetz/home/alul/rtorrent/download/bposter",
  || "/home/mint/projects/parser/downloads",

  VIDEOS_PATH: process.env.VIDEOS_PATH 
  //|| "/home/mint/hetz/home/alul/bposter/videos",
  || "/home/mint/projects/parser/videos",

  CONTACT_SHEETS_PATH: '/home/mint/projects/parser/contactsheets',

  VENDOR_PATH: '/home/mint/projects/parser/vendor',

  FILE_TYPES: [
    'jpg',
    'jpeg',
    'gif',
    'tiff',
    'png',
    'bmp'
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
