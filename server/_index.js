const { SERVER_PORT, DROP_DATABASE } = require("./config");

const http = require("http");
const logger = require("../logger")(module.filename);
const { Torrent, connection } = require("./db");

let torrentData = {};
  
if (DROP_DATABASE && connection) {
  connection.dropDatabase((error, result) => {
    if(error) {
      logger.error(error);
      return;
    }
    logger.debug(`database dropped: ${result}`);
  });
}

const server = http.createServer(async (req, res) => {

  req.on('error', err => logger.error(`Error in request ${err}`));

  const { method, url } = req;
  logger.debug(`Method: ${method}, URL: ${url}`)


  if(method === "POST") {
    let postData = [];

    req.on("data", chunk => postData.push(chunk));

    req.on("end", async () => {

      postData = JSON.parse(Buffer.concat(postData).toString());

      logger.debug(JSON.stringify(postData));
      
      if(url === "/save-path") {
        torrentData.filePath = postData.filePath;
        const torrent = new Torrent(torrentData);
        const saveResult = await torrent.save();

      } else if (url === "/save-title-tags") {
        torrentData.title = postData.title;
        torrentData.tags = postData.tags;

      } else if (url === "/save-files") {

        const updateRes = await Torrent.updateOne(
          {_id: postData._id}, 
          {files: postData.files}
        );
        res.end(`Updated ${updateRes.nModified}`);
      }

    }); 

  } else if (method === "GET") {

    if(url === "/get-all-torrents") {
      let searchResult = await Torrent.find({});
      searchResult = JSON.stringify(searchResult);
      res.setHeader("Content-Type", "application/json");
      res.end(searchResult);
      return;
    }

    if(url === "/test") {
      res.end("Parser server is working!");
      return;
    }

    if(url === "/admin") {

      let searchResult = await Torrent.find({});
      
      let response = `<ul>`;
      searchResult.forEach(torrent => {
        response += `<li>
          <h2>${torrent.title}</h2>
          <p>${torrent.tags}</p>
          <p>${torrent.filePath}</p>`;

        if(torrent.files) {
          response += `<ul>`;
          torrent.files.forEach(file => {
            response += `<li>${file}</li>` 
          });
          response += `</ul>`;
        } 
      });

      response += `</ul>`;
       
      res.setHeader("Content-Type", "text/html");
      res.end(response);
    }
  }
  
});
  
server.listen(SERVER_PORT, 
  () => {
    logger.info(`Server is listening on port ${SERVER_PORT}`);
  });

