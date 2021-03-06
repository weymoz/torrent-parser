const logger = require('../../logger')(module.filename);
const Video = require('mongoose').model('video');
const { inspect } = require('util');
const { basename } = require('path');
const { SERVER_PORT } = require('../config');

module.exports = async (req, res, next) => {
    let videos = await Video.findAllAndPopulate();

    logger.debug(`Copied videos:\n${inspect(videos)}`);

    if(!videos) {
        logger.error(`No video documents have been found in Video collection`);
        return;
    }

    videos = videos.map(video => {
        const { 
            torrentId, 
            path, 
            metadata, 
            contactsheetPath, 
            contactsheetImgUrl,
            contactsheetThumbUrl,
            screenshotsPath,
            screenshotsUrl,
            filehostLinks,
        } = video;

        const contactsheetLocalUrl = video.contactsheetPath ? 
            basename(video.contactsheetPath) : undefined;

        const screenshotsLocalUrls = video.screenshotsPath ? 
            video.screenshotsPath.map(path => basename(path)) : undefined;

        return {
            title: torrentId.title, 
            path, 
            metadata, 
            contactsheetPath, 
            contactsheetLocalUrl,
            contactsheetImgUrl,
            contactsheetThumbUrl,
            screenshotsPath,
            screenshotsLocalUrls,
            screenshotsUrl,
            filehostLinks,
        };
    });

    logger.debug(inspect(videos));

    res.render('copied-files', {
        copiedFiles: videos, 
        filesCount: req.query.filesCount,
        serverPort: SERVER_PORT
    });
}
