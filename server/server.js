const http = require("http");
const logger = require("./logger");
const Torrents = require("./torrentModel");

const PORT = 3000;
let torrentData = {};

const server = http.createServer((req, res) => {
  
  let postBody = [];

  req.on("error", err => console.log.bind(console, err))
     .on("data", chunk => postBody.push(chunk))
     .on("end", () => {
        postBody = JSON.parse(Buffer.concat(postBody).toString());
    
        if(postBody.filePath) {
          torrentData.filePath = postBody.filePath;
          const torrrent = new Torrents(torrentData);

          torrrent.save()
            .then(() => Torrents.findOne({filePath: postBody.filePath}))
            .then(savedTorrent => logger.info(savedTorrent));

    } else {
      torrentData.title = postBody.title;
      torrentData.tags = postBody.tags;
    }
    
  });

});

server.listen(PORT, console.log.bind(console, `Parser server is listening on port ${PORT}`));
