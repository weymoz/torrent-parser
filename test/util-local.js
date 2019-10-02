var assert = require('assert');
const { getTime, 
  fileExist, 
  filterFileList,
  filterFileListByPath,
  copyFileObject,
  copyFiles
} = require('../server/utils-local');
const path = require('path');
const util = require('util');
const fs = require('fs');

describe.skip('getTime()', function() {
  it('should transform time in seconds to HHh MMmin SSsec format', 
    function() {
      const seconds = 2 * 60 * 60 + 45 * 60 + 12;
      const actual = getTime(seconds);
      const expected = "2h 45min 12sec";
      assert.equal(actual, expected);
    });
});

describe('fileExist()', function() {
  it('should return true if file exist', async function() {
    const result = await fileExist('package.json');
    assert.equal(result, true);
  });

  it('should return true if absolute path exist', async function() {
    const absPath = path.join(__dirname, 'util-local.js');
    const result = await fileExist(absPath);
    assert.equal(result, true);
  });

  it('should return false if file does not exist', async function() {
    const result = await fileExist('package.js');
    assert.equal(result, false);
  });

  it('should return false if absolute path does not exist', async function() {
    const absPath = path.join(__dirname, 'util-local');
    const result = await fileExist(absPath);
    assert.equal(result, false);
  });
});


describe("filterFileList()", function() {

  it("with argument [String] it should return file list without files that not exist", async function() {
    const inputList = [
      path.join(__dirname, 'a.txt'),
      path.join(__dirname, 'b.txt'),
      path.join(__dirname, 'c.txt'),
      path.join(__dirname, 'd.txt'),
    ];

    const actual = await filterFileList(inputList);


    const expected = [
      path.join(__dirname, 'a.txt'),
      path.join(__dirname, 'b.txt'),
      path.join(__dirname, 'd.txt'),
    ];

    assert.deepEqual(actual, expected)
  })


  it("with argument [{src: String}] it should return file list without files that not exist", async function() {
    const inputList = [
      { src: path.join(__dirname, 'a.txt'), title: "file a.txt" },
      { src: path.join(__dirname, 'b.txt'), title: "file b.txt" },
      { src: path.join(__dirname, 'c.txt'), title: "file c.txt" },
      { src: path.join(__dirname, 'd.txt'), title: "file d.txt" },
    ];

    const actual = await filterFileList(inputList);


    const expected = [
      { src: path.join(__dirname, 'a.txt'), title: "file a.txt" },
      { src: path.join(__dirname, 'b.txt'), title: "file b.txt" },
      { src: path.join(__dirname, 'd.txt'), title: "file d.txt" },
    ];

    assert.deepEqual(actual, expected)
  })

  it("with argument [{path: String}] it should return file list without files that not exist", async function() {
    const inputList = [
      { path: path.join(__dirname, 'a.txt'), title: "file a.txt" },
      { path: path.join(__dirname, 'b.txt'), title: "file b.txt" },
      { path: path.join(__dirname, 'c.txt'), title: "file c.txt" },
      { path: path.join(__dirname, 'd.txt'), title: "file d.txt" },
    ];

    const actual = await filterFileList(inputList);


    const expected = [
      { path: path.join(__dirname, 'a.txt'), title: "file a.txt" },
      { path: path.join(__dirname, 'b.txt'), title: "file b.txt" },
      { path: path.join(__dirname, 'd.txt'), title: "file d.txt" },
    ];

    assert.deepEqual(actual, expected)
  })
})


describe("filterFileListByPath()", function() {
  it("should filter files that not exist", async function() {
    const inputList = [
      { path: path.join(__dirname, 'a.txt'), title: "file a.txt" },
      { path: path.join(__dirname, 'b.txt'), title: "file b.txt" },
      { path: path.join(__dirname, 'c.txt'), title: "file c.txt" },
      { path: path.join(__dirname, 'd.txt'), title: "file d.txt" },
    ];

    const actual = await filterFileListByPath(inputList, 'path');

    const expected = [
      { path: path.join(__dirname, 'a.txt'), title: "file a.txt" },
      { path: path.join(__dirname, 'b.txt'), title: "file b.txt" },
      { path: path.join(__dirname, 'd.txt'), title: "file d.txt" },
    ];

    assert.deepEqual(actual, expected)
  })
})


describe("copyFileObject()", function() {
  it("should copy file to the new destination", function(done) {

    const file = {
      someProp: 'Some property',
      src: path.join(__dirname, 'a.txt'),
      dest: path.join(__dirname, 'a1.txt')
    }

    copyFileObject(file).then((result) => {
      let srcData = '';
      let destData = '';

      fs.createReadStream(result.src)
        .on('data', chunk => srcData += chunk)
        .on('end', () => {
          fs.createReadStream(result.dest)
            .on('data', chunk => destData += chunk)
            .on('end', () => {
              console.log(srcData);
              console.log(destData);
              assert.equal(srcData, destData);
              done();
            })
        })
    });
    
  })

  it("should return object identical to passed argument", async function() {

    const file = {
      someProp: 'Some property',
      src: path.join(__dirname, 'a.txt'),
      dest: path.join(__dirname, 'a1.txt')
    }

    const result = await copyFileObject(file);

    assert.deepEqual(result, file);
  })

  it("should return an error if there is no source file", async function() {
    const file = {
      someProp: 'Some property',
      src: path.join(__dirname, 'f.txt'),
      dest: path.join(__dirname, 'a1.txt')
    }

    const result = await copyFileObject(file);
    assert('errno' in result);
  });

})


describe("copyFiles()", function() {
  it("should return list of files identical to input list", async function() {

    const file1 = {
      someProp: 'Some property 1',
      src: path.join(__dirname, 'a.txt'),
      dest: path.join(__dirname, 'a1.txt')
    }

    const file2 = {
      someProp: 'Some property 2',
      src: path.join(__dirname, 'b.txt'),
      dest: path.join(__dirname, 'b1.txt')
    }

    const files = [file1, file2];

    const result = await copyFiles(files);

    assert.deepEqual(result, files);
  })

  it("should return an array with second element = error", async function() {

    const file1 = {
      someProp: 'Some property 1',
      src: path.join(__dirname, 'a.txt'),
      dest: path.join(__dirname, 'a1.txt')
    }

    const file2 = {
      someProp: 'Some property 2',
      src: path.join(__dirname, 'f.txt'),
      dest: path.join(__dirname, 'f1.txt')
    }

    const files = [file1, file2];

    const result = await copyFiles(files);
    assert('errno' in result[1]);
  })

})
