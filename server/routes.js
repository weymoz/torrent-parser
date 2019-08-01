const express = require('express');
const logger = require("../logger")(module.filename);

const router = express.Router();
const root = require('./controllers/root');
const addTorrent = require('./controllers/addTorrent');
const admin = require('./controllers/admin');
const savePath = require('./controllers/savePath');
const saveTitleTags = require('./controllers/saveTitleTags');

router.get('/', root);
router.get('/admin', admin);
router.post('/save-path', savePath);
router.post('/save-title-tags', saveTitleTags);

module.exports = router;
