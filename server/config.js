module.exports = {
  DATABASE_URL: process.env.DATABASE_URL || "mongodb://localhost/parser",

  DROP_DATABASE: process.env.DROP_DATABASE !== "false" && false,

  SERVER_PORT: process.env.SERVER_PORT || 3000,

  TORRENTS_PATH: process.env.TORRENTS_PATH 
  //|| "/home/alul/rtorrent/watch/bposter"
  || "/home/mint/hetz/home/alul/rtorrent/watch/bposter",

  DOWNLOADS_PATH: process.env.DOWNLOADS_PATH 
  || "/home/mint/hetz/home/alul/rtorrent/download/bposter",

  VIDEOS_PATH: process.env.VIDEOS_PATH 
  || "/home/mint/hetz/home/alul/bposter/videos",

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
