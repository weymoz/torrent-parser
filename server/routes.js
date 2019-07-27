const express = require('express');
const logger = require("../logger")(module.filename);

const router = express.Router();
const root = require('./controllers/root');
const addTorrent = require('./controllers/addTorrent');
const admin = require('./controllers/admin');

router.get('/', root);
router.get('/add-torrent', addTorrent);
router.get('/admin', admin);

module.exports = router;
