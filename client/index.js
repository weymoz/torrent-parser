const http = require("http");
const url = require("url");
const logger = require("../logger")(module.filename);

exports.get = async url => {
  return new Promise((resolve, reject) => {

    const request = http.get(url, res => {
      
      const { statusCode } = res;
      const contentType = res.headers['content-type'];
    
      let error;
     
      if(statusCode !== 200) {
        error = new Error("Request failed: \nStatus code: " + statusCode);
      } else if(!/application\/json/.test(contentType)) {
        error = new Error(`Invalid content type:
        Expected application/json, reseived ${contentType}`);
      }
    
      if(error) {
        logger.error(error.message);
        res.resume();
        reject(error);
      }
    
    
      res.setEncoding("utf8");
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          data = JSON.parse(data);
          resolve(data);
        } catch (error) {
          logger.error(error.message);
          reject(error);
        }
      });
    });
    
    request.on("error", error => {
        logger.error(error.message);
        reject(error);
      }
    );
  })
}

exports.post = (postUrl, data) => {

  const urlObj = url.parse(postUrl);
  const postData = JSON.stringify(data);
  urlObj.method = "POST";
  urlObj.headers = {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
  };

  const req = http.request(urlObj, (res) => {
    res.setEncoding("utf8");
    res.on("data", chunk => console.log(`[SAVE RESPONSE] ${chunk}`));
    res.on("end", console.log.bind(console, "[RESPONSE ENDED]"));
  });

  req.on('error', (error) => {
      logger.error(`problem with request: ${error.message}`);
  });

  req.write(postData);
  req.end();
}
