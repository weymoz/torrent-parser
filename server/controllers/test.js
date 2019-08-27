const fs = require('fs');
const SRC_FOLDER = '/home/mint/projects/parser/downloads';
const DEST_FOLDER = '/home/mint/projects/parser/videos';

module.exports = (req, res) => {
  copy1();
  res.send('test');
}

function copy1() {
  [4, 5, 6].forEach(n => {
    fs.copyFile(`${SRC_FOLDER}/${n}.mp4`, `${DEST_FOLDER}/${n}.mp4`, err => {
      if(err) {
        console.log(err);
        return;
      }
      console.log(`Copied file #${n}`);
    });
  });
}
