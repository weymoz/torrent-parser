const logger = require("../../logger")(module.filename);
const { DATABASE_URL, DROP_DATABASE } = require("../config");
const mongoose = require("mongoose");

mongoose.connect(DATABASE_URL, {useNewUrlParser: true});

const db = mongoose.connection;

db.on("error", () => {
  logger.error("connection error");
  process.exit(0);
})
  .on("open", () => {
    logger.info("connection OK")

  if (DROP_DATABASE) {
    db.dropDatabase((error, result) => {
      if(error) {
        logger.debug(`Error dropping database`);
        logger.error(error);
        return;
      }
      logger.debug(`database dropped: ${result}`);
    });
  }
  });

module.exports = db;

