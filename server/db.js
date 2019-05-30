const logger = require("./logger");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/parser", {useNewUrlParser: true});

const db = mongoose.connection;

db.on("error", console.log.bind(console, "connection error"))
  .on("open", () => {
    logger.info("connection OK") 
    mongoose.connection.collections.torrents.drop(() => {
      logger.info("collection torrents dropped");
    });
  });

module.exports = db;

