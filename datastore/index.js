const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      console.log(err);
    }
    counter.writeCounter(id, (err, zeroPaddedId) => {
      if (err) console.log(err);
      fs.writeFile(path.join(exports.dataDir, `${zeroPaddedId}.txt`), text, (err) => {
        if (err) {
          throw ('error writing counter');
        } else {
          items[id] = text;
          callback(null, { id, text });
        }
      });
    }) 
  });
};

exports.readAll = (callback) => {

  fs.readdir(exports.dataDir, function (err, filenames) {
    var dataArr = [];
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach((filename) => {
      filename = path.basename(filename, '.txt')
      var obj = {"id": filename, "text": filename};
      dataArr.push(obj);
    });
    callback(null, dataArr);
  });

};

exports.readOne = (id, callback) => {
  fs.readFile(path.join(exports.dataDir, `${id}.txt`), (err, text) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      text = text.toString();
      callback(null, { id, text });
    }
  });
};

exports.update = (id, text, callback) => {
  fs.access(path.join(exports.dataDir, `${id}.txt`), fs.F_OK, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.access(path.join(exports.dataDir, `${id}.txt`), fs.F_OK, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.unlink(path.join(exports.dataDir, `${id}.txt`), (err) => {
        if (err) {
          callback(new Error(`No item with id: ${id}`));
        } else {
          callback();
        }
      });
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
