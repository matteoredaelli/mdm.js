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
      "import": new mdm_db(path, "import"),
      "append": new mdm_db(path, "append"),
      "merge":  new mdm_db(path, "merge"),
      "export": new mdm_db(path, "export"),
      "audit":  new mdm_db(path, "audit")
    }
    this.audit = new mdm_audit(this.settings.audit, this.db.audit, this.settings.mdm.timestamp_key)

    // console.log("activating logging for database <import> PUT actions");
    // this.db.import.db.on('put', function (key, value) {
    //    console.debug('Trigger db <import> after PUT: normalize and save to <append> database')
    //    self.step_append(value)
    // })

    // console.log("activating logging for database <append> PUT actions");
    // this.db.append.db.on('put', function (key, value) {
    //    console.debug('DB <append>: inserted', { key, value })
    //    console.debug('Trigger db <append> after PUT: normalize and save to <merge> database')
    //    self.step_merge(value)
    // })

    // this slows down too much the import.. better to do this step only when we want to export the data
    // console.log("activating logging for database <merge> PUT actions");
    // this.db.merge.db.on('put', function (key, value) {
    //    console.debug('DB <merge>: inserted', { key, value })
    //    console.debug('Trigger db <merge> after PUT: normalize and save to <export> database')
    //    self.step_export(value)
    // })
  }

  get_document_id(obj, step) {
    const nokey = "_NOKEY_";
    const keys = this.settings.steps[step].keys[0];
    if (step == "merge") {
      // extract key from first obj
      obj = Object.values(obj)[0]
    }
    const map = keys.map(x => x in obj ? obj[x] : nokey);
    const id = map.includes(nokey) ? null : map.join('-');
    console.debug("get_id: id=" + id + ", step=" + step)
    return id;
  }

  step_import(obj) {
    const step="import";
    var self = this;
    obj = obj_utils.normalize(obj, this.settings.steps[step].rules)
    const id = this.get_document_id(obj, step)
    const ts = obj[this.settings.mdm.timestamp_key];
    self.db[step].load_raw(id)
    .then(function (obj_new) {
      console.log("step_import: retreived object ")
      console.debug(obj_new)
      obj_new["_LASTUPDATE_"] = ts
      return self.db[step].save_raw(id, obj_new)
    })
    .catch(function (err) {
      console.error(err);
      var obj_new = obj
      obj_new["_LASTUPDATE_"] = ts
      obj_new["_CREATED_"] = ts
      return self.db[step].save_raw(id, obj_new)
    })
  }

  step_append(obj) {
    const step = "append";
    var self = this;
    obj = obj_utils.normalize(obj, self.settings.steps[step].rules)
    this.audit.save_new_values(obj)
    let local_id = obj[self.settings.mdm.source_system_key]
    const id = this.get_document_id(obj, step)
    if (! id) {
      console.error("Step " + step + ": missing ID keys in doc " + obj)
    } else {
      self.db[step].load_raw(id)
      .then(function (obj_new) {
        console.log("step_append: retreived object ")
        console.debug(obj_new)
        obj_new[local_id] = obj
        if (obj_new["_LASTUPDATE_"] < obj["_LASTUPDATE_"] ) {
          obj_new["_LASTUPDATE_"] = obj["_LASTUPDATE_"];
        }
        return self.db[step].save_raw(id, obj_new);
      })
      .catch(function (err) {
        console.error(err);
        var obj_new = {}
        obj_new[local_id] = obj;
        obj_new["_LASTUPDATE_"] = obj["_LASTUPDATE_"]
        obj_new["_CREATED_"] = obj["_CREATED_"]
        let ts = obj["_CREATED_"];
        if (ts == null) {
          ts = new Date().toJSON()
        }
        self.audit.log("new item:" + id, ts)
        return self.db[step].save_raw(id, obj_new);
      })
    } // end else
  }

  step_merge(obj) {
    var self = this;
    var obj_new = obj;
    const step = "merge"
    const created = obj["_CREATED_"];
    const lastupdate = obj["_LATUPDATE_"];
    delete obj["_CREATED_"];
    delete obj["_LATUPDATE_"]
    let skip_keys = self.settings.steps[step].keys[0]
    let objList = Object.values(obj)
    console.debug("step merge: input is " + JSON.stringify(obj))
    const id = this.get_document_id(obj, step)
    if (! id) {
      console.error("Step " + step + ": missing ID keys in doc " + obj)
    } else {
      let obj_new = obj_utils.merge_objects(objList, skip_keys, self.settings.mdm.source_system_key, {})
      obj_new["_CREATED_"] = created;
      obj_new["_LATUPDATE_"] = lastupdate;
      return this.db[step].save_raw(id, obj_new)
    }
  }

  step_export(obj) {
    const step = "export"
    var new_obj = obj_utils.export_object(obj, this.settings.steps[step].fields)
    console.debug(new_obj)
    const id = this.get_document_id(new_obj, step)
    this.db[step].save_raw(id, new_obj)
  }

  step(step, obj) {
    var self = this;
    switch (step) {
      case 'append':
        self.step_append(obj)
        break
      case 'merge':
        self.step_merge(obj)
        break
      case 'export':
        self.step_export(obj)
        break
      default:
      console.log("Unknown step" + step)
    }

  }


}

module.exports = Mdm
