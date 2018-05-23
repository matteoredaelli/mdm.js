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

class Audit {
  constructor(fields_list, db, timestamp_key) {
    this.db = db
    this.fields_list = fields_list
    this.timestamp_key = timestamp_key
    console.debug(db.dbname + ": " + fields_list)

    // console.log("activating logging for database <audit> PUT actions");
    // this.db.db.on('put', function (key, value) {
    //    console.debug('Inserted', { key, value })
    // })

  }

  get_key(keys, values, sep1 = "!", sep2=";") {
    const key =  keys.join(sep1) + sep2 + values.join(sep1)
    console.debug("get_key from keys=" + keys + " and values=" + values)
    console.debug("  key=" + key)
    return key
  }

  log(text, day) {
    const key = '_LOG_' + day // new Date().toJSON().slice(0,10).replace(/-/g,'');
    return this.db.save_raw_push(key, text, false)
  }

  save_new_values(obj, sep="|") {
    var self = this;
    var values = {}
    this.fields_list.forEach(function(keys) {
      console.debug("keys=" + keys)
      if (keys[0] == '_FIELD_') {
        // saving objec keys
        Object.keys(obj).forEach(function(k,ix) {
          self.db.save_raw_push("_FIELD_", k, true)
        })
      } else {
        values = keys.map( x => (x in obj) ? obj[x] : "NULL");
        self.db.save_raw_push('_KEY_' + keys.join(sep), values.join(sep), true)
      }
    });
  }

  empty() {
    this.db.empty()
  }

}

module.exports = Audit
