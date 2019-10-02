const { 
  CONFIG_MODE,
  SERVER_PORT, 
  CONTACT_SHEETS_PATH,
  SCREENSHOTS_PATH,
  DOCS_PATH
} = require("./config");
require('./db/connection');
require('./db/models/torrent');
require('./db/models/video');
const logger = require("../logger")(module.filename);
const express = require('express');
const routes = require('./routes');
const path = require('path');
const cors = require('cors');

logger.info("Configuration mode: " + CONFIG_MODE);

const app = express();

app.use(cors());
app.use(express.json());

//serve static files
app.use(express.static(path.join(__dirname, 'public')));
logger.info("Contactsheets: " + CONTACT_SHEETS_PATH);
app.use(express.static(CONTACT_SHEETS_PATH));
app.use(express.static(SCREENSHOTS_PATH));
app.use(express.static(DOCS_PATH));
logger.info(`Documentation: ${DOCS_PATH}`);

//View engine
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

//Routing
app.use('/', routes);

app.listen(SERVER_PORT, 
  logger.info.bind(logger, 
    `Torrent Server is listening on port ${SERVER_PORT}`));
