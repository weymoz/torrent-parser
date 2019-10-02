const logger = require("../../logger")(module.filename);
const { DATABASE_URL } = require("../config");
const mongoose = require("mongoose");
const {inspect} = require('util');
const altUrl = 'mongodb://dev:qxwv_35AZSC@176.9.155.242:27017/parser';

mongoose.connect(altUrl, {useNewUrlParser: true});

const db = mongoose.connection;

db.on("error", () => {
  logger.error("connection error");
  process.exit(0);
})
  .on("open", () => {
    logger.info("Connection OK");
    db.db.listCollections().toArray(function (err, names) {
      logger.info(inspect( names ));
    });
  });

module.exports = db;

