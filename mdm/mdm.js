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
var mdm_keys = require('./document_keys');
var mdm_values = require('./document_values');
var mdm_db = require('./db');
var fs = require('fs');

class Mdm {
  constructor(settings) {
    const path = settings.fs.data_directory;
    this.settings = settings
    this.keys = new mdm_keys(path + '/' + settings.fs.document_keys_file)
    this.values = new mdm_values(path + '/' + settings.fs.document_values_file)
    this.db = new mdm_db(path)
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

  get_document_id(doc, step) {
    const nokey = "__NOKEY__";
    const keys = this.settings.steps[step].keys[0];
    const map = keys.map(x => x in doc ? doc[x] : nokey);
    const id = map.includes(nokey) ? null : map.join('-');
    return id;
  }

  import_document(obj, step) {
    obj = obj_utils.normalize(obj, this.settings.steps[step].rules)
    this.keys.add_keys_from_document(obj)
    const import_id = this.get_document_id(obj, "import")
    const id = this.get_document_id(obj, step)
    if (id) {
      this.db.save_obj(step, id, obj, import_id)
    } else {
      log.error("Step " + step + ": missing keys in doc " + obj)
    }
    return obj;
  }


  merge_documents() {
    var self = this;
    const from_step   = "import";
    const target_step = "work";
    const path = self.db.path + '/import';

    fs.readdir(path, function(err, items) {
      for (var i=0; i<items.length; i++) {
          let filename = items[i]
          console.log(filename);
          doc = db.load(filename, null, "import")
          doc.normalize(self, target_step)
          doc.save("export")
        }
      });
    }
  }

module.exports = Mdm
