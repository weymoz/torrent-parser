const { SERVER_PORT, DROP_DATABASE } = require("./config");
const logger = require("../logger")(module.filename);
const { Torrent, connection } = require("./db");
const express = require("express");
const routes = require('./routes');
const path = require('path');

if (DROP_DATABASE && connection) {
  connection.dropDatabase((error, result) => {
    if(error) {
      logger.error(error);
      return;
    }
    logger.debug(`database dropped: ${result}`);
  });
}

const app = express();

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
