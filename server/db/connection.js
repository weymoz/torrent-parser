const logger = require("../../logger")(module.filename);
const { DATABASE_URL } = require("../config");
const mongoose = require("mongoose");

mongoose.connect(DATABASE_URL, {useNewUrlParser: true});

const db = mongoose.connection;

db.on("error", () => {
  logger.error("connection error");
  process.exit(0);
})
  .on("open", () => logger.info("connection OK"));

module.exports = db;

