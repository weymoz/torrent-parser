const fs = require('fs');
const util = require('util');
const stat = util.promisify(fs.stat);
const copy = util.promisify(fs.copyFile);
const logger = require('../../logger')(module.filename)
const ffmpeg = require('fluent-ffmpeg');


exports.basenameWitoutExtention = function basenameWitoutExtention(filename) {
    return filename.split('.').slice(0, -1).join('.')
}


exports.splitFileToArray = path => {
    return new Promise((resolve) => {
        let lines = [];
        const src = fs.createReadStream(path);
        src.setEncoding('utf8');

        let i = 0;
        let rest = '';

        src.on('data', chunk => {
            rest += chunk; let i = 0;
            while((i = rest.indexOf('\n')) > -1) {
                lines.push(rest.substring(0, i));
                rest = rest.substring(i + 1);
            }
        });

        src.on('end', resolve.bind(null, lines));
    });
}


exports.lastItem = arr => arr[arr.length - 1];
exports.secondLastItem = arr => arr[arr.length - 2];
exports.thirdLastItem = arr => arr[arr.length - 3];

exports.getTime = seconds => 
    Math.floor(seconds / 3600).toString() + 
        'h ' + Math.floor((seconds % 3600) / 60) + 'min ' + 
        Math.floor(seconds % 60) + 'sec';


exports.formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


const fileExist = 
    /**
     * Checks if provided path exists
     * @param {string} file - path to the file
     * @returns {boolean} Returns <b>true</b> if file exists,
     * otherwise returns <b>false</b>
     */
    exports.fileExist = async file => {
        const result = await stat(file).catch(() => ( {size: 0} ));
        return result.size > 0;
    }

/**
 * Filter list of file paths, removes paths that does not exist
 * @param {Array} fileList - list of file paths
 * @returns {Promise} returns promise resolved with  filtered list of file paths
 */
exports.filterFileList = async fileList => {
    const checked = await Promise.all(fileList.map(async file => {

        let path = "";
        const argType = typeof file;

        if(argType === "string") {
            path = file;
        } else if (argType === "object") {
            if ( Array.isArray(file) ) 
                throw new Error('Array is not a valid argument');

            if(!file.path 
                && !file.src 
                && !file.contactsheetPath
                && !file.screenshotPath) 
                throw new Error('Objects in the provided list ' +  
                    'of files have no src or path field');

            path = file.path 
                || file.src 
                || file.contactsheetPath
                || file.screenshotPath;
        } else {
            throw new Error(`${file} is not a valid argument`);
        }

        const exist = await fileExist(path);
        return {obj: file, exist};
    }));

    const filtered = checked.filter(item => item.exist);
    return filtered.map(item => item.obj);
}


exports.filterFileListByPath = async (fileList, path) => {
    const checked = await Promise.all(fileList.map(async file => {
        const exist = await fileExist(file[path]);
        return {obj: file, exist};
    }));

    const filtered = checked.filter(item => item.exist);
    return filtered.map(item => item.obj);
}


exports.getAllFiles = (folder) => {
    return new Promise(function(resolve, reject) {
        fs.readdir(folder, (err, files) => {
            if(err) return reject(err);
            resolve(files);
        });
    });
}


