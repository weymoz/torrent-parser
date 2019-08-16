const express = require('express');
const logger = require("../logger")(module.filename);

const router = express.Router();
const root = require('./controllers/root');
const admin = require('./controllers/admin');
const save = require('./controllers/save');
const deleteAllTorrents = require('./controllers/deleteAllTorrents');
const deleteAllDownloads = require('./controllers/deleteAllDownloads');
const copy = require('./controllers/copy');

router.get('/', root);
router.get('/admin', admin);
router.post('/save', save);
router.get('/delete-all-torrents', deleteAllTorrents);
router.get('/delete-all-downloads', deleteAllDownloads);
router.get('/copy', copy);

module.exports = router;
