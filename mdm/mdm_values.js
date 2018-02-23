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

class MdmValues {
  constructor(filename) {
    this.rules = {}
    this.filename = filename
  }

  save() {
    const result = yaml.dump(this.rules);
    fs.writeFile(this.filename, result, (err) => {
      if (err) throw err;
      console.log('The file has been saved!');
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

  add_value(key, value, action=null, param1=null) {
    if (!(key in this.rules)) {
      this.rules[key] = {}
    }
    if (!(value in this.rules[key])) {
	this.rules[key][value] = {action: action, param1: param1}
    }
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

module.exports = MdmValues
