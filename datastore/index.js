const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
var Promise = require('bluebird');



// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
    if (err) {
      console.log(err);
    }
    counter.writeCounter(id, (err, zeroPaddedId) => {
      if (err) { console.log(err); }
      var items = {};
      items.id = zeroPaddedId;
      items.text = text;
      items.time = new Date().toLocaleTimeString('en-US');
      items.status = 'created';
      itemsString = JSON.stringify(items);
      fs.writeFile(path.join(exports.dataDir, `${zeroPaddedId}.txt`), itemsString, (err) => {
        if (err) {
          throw ('error writing counter');
        } else {
          callback(null, items);
        }
      });
    }); 
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
      filename = path.basename(filename, '.txt');
      var obj = {'id': filename, 'text': filename};
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
      textObj = JSON.parse(text);
      callback(null, textObj);
    }
  });
};

exports.update = (id, text, callback) => {
  fs.access(path.join(exports.dataDir, `${id}.txt`), fs.F_OK, (err) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      exports.readOne(id, (err, textObj) => {
        textObj.text = text;
        textObj.time = new Date().toLocaleTimeString('en-US');
        textObj.status = 'updated';
        itemsString = JSON.stringify(textObj);
        fs.writeFile(path.join(exports.dataDir, `${id}.txt`), itemsString, (err) => {
          if (err) {
            callback(new Error(`No item with id: ${id}`));
          } else {
            callback(null, textObj);
          }
        });
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
