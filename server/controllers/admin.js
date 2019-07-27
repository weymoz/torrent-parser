const { Torrent } = require("../db");

module.exports = async (req, res) => {
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
