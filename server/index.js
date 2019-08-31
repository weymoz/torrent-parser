const { SERVER_PORT } = require("./config");
require('./db/connection');
require('./db/models/torrent');
require('./db/models/video');
const logger = require("../logger")(module.filename);
const express = require('express');
const routes = require('./routes');
const path = require('path');
const cors = require('cors');



const app = express();

app.use(cors());
app.use(express.json());

//serve static files
app.use(express.static(path.join(__dirname, 'public')));

//View engine
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

//Routing
app.use('/', routes);

app.listen(SERVER_PORT, 
  logger.info.bind(logger, 
    `Torrent Server is listening on port ${SERVER_PORT}`));
