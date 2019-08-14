const express = require('express');
const logger = require("../logger")(module.filename);

const router = express.Router();
const root = require('./controllers/root');
const admin = require('./controllers/admin');
const save = require('./controllers/save');
const deleteAll = require('./controllers/deleteAll');

router.get('/', root);
router.get('/admin', admin);
router.post('/save', save);
router.get('/delete-all', deleteAll);

module.exports = router;
