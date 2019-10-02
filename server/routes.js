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
  clearFolder,
  getMetadata,
  contactsheets,
  uploadContactsheets,
  uploadScreenshots,
  screenshots,
  archives,
  deleteVideos,
  deleteContactsheets,
  deleteScreenshots,
  uploadVideos,
  parseLinks,
  updateVideos
} = require('./controllers');

router.get('/', root);
router.get('/admin', admin);
router.post('/save', save);
router.get('/delete-all-torrents', deleteAllTorrents);
router.get('/delete-all-downloads', deleteAllDownloads);
router.get('/copy', 
  clearFolder, 
  copy, 
  getMetadata, 
  contactsheets, 
  uploadContactsheets, 
  screenshots, 
  uploadScreenshots,
  archives
);
router.get('/get-metadata', getMetadata);
router.get('/copied-files', copiedFiles);
router.get('/contactsheets', contactsheets);
router.get('/upload-contactsheets', uploadContactsheets);
router.get('/upload-screenshots', uploadScreenshots);
router.get('/screenshots', screenshots);
router.get('/test', test);
router.get('/archives', archives);
router.get('/delete-videos', deleteVideos);
router.get('/delete-contactsheets', deleteContactsheets);
router.get('/delete-screenshots', deleteScreenshots);
router.get('/delete-videos', deleteVideos);
router.get('/upload-videos', uploadVideos);
router.get('/parse-links', parseLinks);
router.get('/update-videos', updateVideos);

module.exports = router;
