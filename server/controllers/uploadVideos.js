const logger = require('../../logger')(module.filename);
const mongoose = require('mongoose');
const Video = mongoose.model('video');
const request = require('request');
const fs = require('fs');
const util = require('util');

const { 
  SINGLE_OP_MODE,
} = require('../config');



const options = {
  headers: {
    "Accept": "application/json",
  },
  method: 'GET',
};


module.exports = async (req, res, next) => {
  const loginResponse = await login();
  logger.info(loginResponse);
  res.send("upload videos");
}


function login() {
  return new Promise((resolve, reject) => {
    request.post({
      url: 'http://keep2share.cc/api/v2/login',
      form: JSON.stringify({
        username: 'biz78ex@gmail.com',
        password: 'qxwv35azsc'
      })
    }, 
      (err, resp, body) => {
        if(err) {
          logger.error('Login error:');
          logger.error(err);
          reject(err);
          return;
        }
        logger.info(util.inspect(resp.body));
        resolve(JSON.parse(body));
      })
  })
}
