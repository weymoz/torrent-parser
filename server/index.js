const { SERVER_PORT, DROP_DATABASE } = require("./config");
const logger = require("../logger")(module.filename);
const { Torrent, connection } = require("./db");
const express = require("express");

const app = express();

app.get('/', (req, res) => {
  res.send("Hello world");
});




app.listen(SERVER_PORT, 
  logger.info.bind(logger, 
    `Torrent Server is listening on port ${SERVER_PORT}`));
