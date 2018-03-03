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

const level = require('level')
var fs = require('fs')

//db.put('example', {"a": 42}, function (err) {


//})

class DB{
  constructor(path, dbname) {
    this.path = path;
    this.dbname = dbname;
    fs.existsSync(path) || fs.mkdirSync(path);
    this.db = level(path + "/" + dbname, { valueEncoding: 'json' })
  }

  save_raw(id, doc) {
    console.debug("DB <" + this.dbname + ">: saving document id=<"  + id)
    this.db.put(id, doc, function (err)  {
      if (err) {
        console.error('Cannot save document due to err=' + err + ', doc=' + doc);
        throw err;
      }
    });
  }

  load_raw(id) {
    this.db.get(id)
    .then(function (value) {
      console.log(value)
      return value})
    .catch(function (err) {
      console.error(err)
      return {} })
  }

  save_obj(id, doc, import_id) {
    var raw = this.load_raw(id);
    console.log(raw);
    if (! raw) {
      raw = {}
    };
    raw[import_id] = doc;
    return this.save_raw(id, raw)
  }

  load_obj(id) {
    var raw = this.load_raw(id);
    return raw.includes(id) ? raw[id] : {}
  }

}
module.exports = DB
