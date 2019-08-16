module.exports = {
  DATABASE_URL: process.env.DATABASE_URL || "mongodb://localhost/parser",
  DROP_DATABASE: process.env.DROP_DATABASE !== "false" && false,
  SERVER_PORT: process.env.SERVER_PORT || 3000,
  TORRENTS_PATH: process.env.TORRENTS_PATH 
  //|| "/home/alul/rtorrent/watch/bposter"
  || "/home/mint/projects/parser/torrents"
};
