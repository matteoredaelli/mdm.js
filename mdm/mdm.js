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
    this.db = new mdm_db(settings.db)
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

  import_document(obj) {
    obj = obj_utils.normalize(obj, this.settings.steps.import.rules);
    obj = obj_utils.normalize(obj, this.settings.steps.export.rules);
    this.keys.add_keys_from_document(obj)
    this.db.save_doc("import", obj_utils.get_unique_key(obj), obj)
  }

  export_db() {
    var self = this;
    const target_step="export";
    const path = self.settings.fs.import;
    var doc = new mdm_doc(null, self.settings)

    fs.readdir(path, function(err, items) {
      for (var i=0; i<items.length; i++) {
          let filename = items[i]
          console.log(filename);
          doc.load(filename, null, "import")
          doc.normalize(self, target_step)
          doc.save("export")
        }
      });
    }
  }

module.exports = Mdm
