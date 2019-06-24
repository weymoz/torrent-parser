module.exports = {
  DATABASE_URL: process.env.DATABASE_URL || "mongodb://localhost/parser",
  SERVER_URL: process.env.SERVER_URL || "http://localhost",
  SERVER_PORT: process.env.SERVER_PORT || 3000,
  LOG_LEVEL: process.env.LOG_LEVEL || "debug"
};
