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
      "append": new mdm_db(path, "append"),
      "merge": new mdm_db(path, "merge"),
      "audit":   new mdm_db(path, "audit")
    }
    this.audit = new mdm_audit(this.settings.audit, this.db.audit)

    console.log("activating logging for database <import> PUT actions");
    this.db.import.db.on('put', function (key, value) {
       console.debug('DB <import>: inserted', { key, value })
       self.audit.save_new_values(value[key])
       console.debug('Trigger db <import> after PUT: normalize and save to <append> database')
       let obj = value[key]
       obj = obj_utils.normalize(obj, self.settings.steps.append.rules)
       const import_id = self.get_document_id(obj, "import")
       self.save_document(obj, "merge", import_id)
    })

    console.log("activating logging for database <append> PUT actions");
    this.db.append.db.on('put', function (key, value) {
       console.debug('DB <append>: inserted', { key, value })
       console.debug('Trigger db <append> after PUT: normalize and save to <merge> database')
       let objList = Object.values(value)
       let skip_keys = self.settings.steps.merge.keys[0]
       //obj = obj_utils.normalize(obj, self.settings.steps.merge.rules)
       let new_doc = obj_utils.merge_objects(objList, skip_keys, self.settings.steps.import.source_system_key, {})
       //const internal_id = self.get_document_id(obj)
       self.save_document(new_doc, "merge")
    })

    this.load()

  }

  get_id(obj, step) {
    const nokey = "_NOKEY_";
    const keys = settings.steps[step].keys[0];
    const map = keys.map(x => x in obj ? obj[x] : nokey);
    const id = map.includes(nokey) ? null : map.join('-');
    console.debug("get_id: id=" + id + ", step=" + step)
    return id;
  }


  step_merge(obj) {
    var self = this;
    var obj_new = obj;
    const step = "merge"
    let skip_keys = self.settings.steps.merge.keys[0]
    console.debug("merge_doc: input is " + JSON.stringify(doc))
    const id = this.get_document_id(obj, step)
    if (id) {
      self.db[step].get(id)
      .then(function (obj_old) {
        console.log(self.dbdesc + "step_merge: retreived object ")
        console.log(obj_old)
        return self.save_raw(id, obj)
      })
      .catch(function (err) {
        console.error(err);
        obj[import_id] = doc;
        return self.save_raw(id, obj)
      })
      return this.db[step].save_raw(id, obj_new)
    } else {
      console.error("Step " + step + ": missing ID keys in doc " + obj)
    }
    const target_doc =  obj_utils.merge_objects(Object.values(doc), skip_keys, this.settings.steps.import.source_system_key)
    console.debug("merge_doc: output is " + JSON.stringify(target_doc))
    return target_doc;

  }


  save_document(obj, step) {
    const id = this.get_document_id(obj, step)

  }
}

module.exports = Mdm
