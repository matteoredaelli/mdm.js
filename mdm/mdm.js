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

var mdm_keys = require('./mdm_keys');
var mdm_values = require('./mdm_values');

class Mdm {
  constructor(settings) {
    this.settings = settings
    this.keys = new mdm_keys(settings.fs.keys_file)
    this.values = new mdm_values(settings.fs.values_file)
    this.load()
  }

  save() {
    this.keys.save();
    this.values.save();
  }

  load() {
    this.keys.load();
    this.values.load();
  }

  empty() {
    this.keys = new mdm_keys()
    this.values = new mdm_values()
    this.keys.save()
    this.values.save()
  }

}

module.exports = Mdm
