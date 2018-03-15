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
  constructor(fields_list, db) {
    this.db = db
    this.fields_list = fields_list
    console.debug(db.dbname + ": " + fields_list)

    console.log("activating logging for database <audit> PUT actions");
    this.db.db.on('put', function (key, value) {
       console.debug('Inserted', { key, value })
    })

  }

  get_key(keys, values, sep1 = "|", sep2="&") {
    const key =  keys.join(sep1) + sep2 + values.join(sep1)
    console.debug("get_key from keys=" + keys + " and values=" + values)
    console.debug("  key=" + key)
    return key
  }

  add_key_if_new(key) {
    var self = this
    this.db.load_raw(key)
      .then(function (obj) {
        console.debug(key + " is already in the database: nothing to do")
      })
      .catch(function (err) {
        console.error(err);
        return self.db.save_raw(key, Date.now())
      })
  }


  save_new_values(obj) {
    var self = this
    var values = {}
    this.fields_list.forEach(function(keys) {
      console.debug("keys=" + keys)
      if (keys == '_FIELD_') {
        // saving objec keys
        Object.keys(obj).forEach(function(k,v) {
          let key = self.get_key(keys, [k])
          self.add_key_if_new(key)
        })
      } else {
        values = keys.map( x => (x in obj) ? obj[x] : "NULL");
        let key = self.get_key(keys, values)
        self.add_key_if_new(key)
      }
    });
  }

  empty() {
    this.db.empty()
  }

}

module.exports = Audit
