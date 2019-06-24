module.exports = {
  DATABASE_URL: process.env.DATABASE_URL || "mongodb://localhost/parser",
  DROP_DATABASE: process.env.DROP_DATABASE !== "false" && false,
  SERVER_PORT: process.env.SERVER_PORT || 3000,
};
