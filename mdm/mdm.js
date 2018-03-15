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

var obj_utils = require('./object_utils');
var mdm_db = require('./db');
var mdm_audit = require('./audit');
var fs = require('fs');

class Mdm {
  constructor(settings) {
    var self = this;
    const path = settings.fs.data_directory;
    this.settings = settings
    //const reducer = (accumulator, currentValue) => accumulator[currentValue] = new mdm_db(path, currentValue);
    this.db = {
      "import":  new mdm_db(path, "import"),
      "merging": new mdm_db(path, "merging"),
      "audit":   new mdm_db(path, "audit")
    }
    this.audit = new mdm_audit(this.settings.audit, this.db.audit)

    console.log("activating logging for database <import> PUT actions");
    this.db.import.db.on('put', function (key, value) {
       console.debug('Inserted', { key, value })
       self.audit.save_new_values(value[key])
       console.debug('Trigger db <import> after PUT: normalize and save to <merging> database')
       self.save_document(value[key], "merging")
    })

    this.load()

  }

  save() {

  }

  load() {

  }

  merge_doc(doc) {
    return object_utils.merge_objects(Object.values(doc), this.settings.steps.import.source_system_key, {})
  }

  get_document_id(doc, step) {
    const nokey = "__NOKEY__";
    const keys = this.settings.steps[step].keys[0];
    const map = keys.map(x => x in doc ? doc[x] : nokey);
    const id = map.includes(nokey) ? null : map.join('-');
    return id;
  }

  save_document(obj, step) {
    obj = obj_utils.normalize(obj, this.settings.steps[step].rules)
    const import_id = this.get_document_id(obj, "import")
    const id = this.get_document_id(obj, step)
    if (id) {
      return this.db[step].save_obj(id, obj, import_id)
    } else {
      console.error("Step " + step + ": missing ID keys in doc " + obj)
    }
  }
}

module.exports = Mdm
