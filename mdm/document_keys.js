"use strict";

const yaml = require('js-yaml');
const fs   = require('fs');

class DocumentKeys {
  constructor(filename) {
    this.filename = filename
    this.rules = {}
  }

  save() {
    const result = yaml.dump(this.rules);
    fs.writeFile(this.filename, result, (err) => {
      if (err) throw err;
      console.log(`The file ''${this.filename}'' has been saved!`);
    });
  }

  load() {
    var self = this;
    fs.stat(this.filename, function(err, stats) {
      if(err) {
        console.log("cannot open filename "
        + self.filename
        + ". The error code is " + err.code);
      } else {
        self.rules = yaml.safeLoad(fs.readFileSync(self.filename, "utf8"))
      }
    });
  }


  add_key(key, action=null, param1=null) {
    if (!(key in this.rules)) {
      this.rules[key] = [{action: action, param1: param1}]
      this.save();
    }
  }

  add_keys_from_document(doc) {
    var self = this;
    Object.keys(doc).forEach(function (key) {
      self.add_key(key)
    });
  }

  remove_key(key) {
    if (key in this.rules) {
      delete this.rules[key];
    }
  }

  empty() {
    this.rules = {}
  }

}

module.exports = DocumentKeys
