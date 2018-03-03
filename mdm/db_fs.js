/*
#    Copyright (C) 2017 till now -  Matteo.Redaelli@gmail.com>
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU General Public License as published by
#    the Free Software Foundation, either version 3 of the License, or
#    (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU General Public License for more details.
#
#    You should have received a copy of the GNU General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

"use strict";
const yaml = require('js-yaml');
const fs   = require('fs');

class DB{
  constructor(path) {
    this.path = path;
    fs.existsSync(path) || fs.mkdirSync(path);
  }

  get_filename(doc_type, id) {
    const doc_path = this.path + "/" + doc_type;
    const filename = doc_path + '/' + id.replace("/","") + '.yaml';

    fs.existsSync(doc_path) || fs.mkdirSync(doc_path);
    return filename;
  }

  save_raw(doc_type, id, doc) {
    const filename = this.get_filename(doc_type, id);
    const result = yaml.dump(doc);

    fs.writeFile(filename, result, (err) => {
      if (err) {
        console.error('Cannot save document. type=' + doc_type + ', id=' + id + ', doc=' + doc);
        throw err;
      }
      console.log('Saved document. type=' + doc_type + ', id=' + id + ', doc=' + doc);
    });
  }

  load_raw(doc_type, id) {
    var self = this;
    var obj = {};
    const filename = this.get_filename(doc_type, id);
    if (fs.existsSync(filename)) {
      console.debug("loading document from file "
          + filename);
      obj =  yaml.safeLoad(fs.readFileSync(filename, "utf8"))
    } else {
        console.error("cannot open document from file "
          + filename);
    }
    return obj;
  }

  save_obj(doc_type, id, doc, import_id) {
    var raw = this.load_raw(doc_type, id);
    console.log(raw);
    if (! raw) {
      raw = {}
    };
    raw[import_id] = doc;
    return this.save_raw(doc_type, id, raw)
  }

  load_obj(doc_type, id) {
    var raw = this.load_raw(doc_type, id);
    return raw.includes(id) ? raw[id] : {}
  }

}
module.exports = DB
