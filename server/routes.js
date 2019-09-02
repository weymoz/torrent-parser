const express = require('express');
const router = express.Router();
const { 
  admin,
  save,
  test,
  deleteAllTorrents,
  deleteAllDownloads,
  copy,
  copiedFiles,
  root,
  clearFolder
} = require('./controllers');

router.get('/', root);
router.get('/admin', admin);
router.post('/save', save);
router.get('/delete-all-torrents', deleteAllTorrents);
router.get('/delete-all-downloads', deleteAllDownloads);
router.get('/copy', clearFolder, copy);
router.get('/copied-files', copiedFiles);
router.get('/test', test);

module.exports = router;
