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

class MdmDoc {
  /* step: import, work, export */
  constructor(obj, settings, phase) {
    this.obj = obj;
    this.settings = settings;
    this.phase = phase;

  }

  is_valid() {
  }

  get_id() {
    return (this.phase === 'import') ?
      this.obj[this.settings.document.import_keys.source_key] + '-' + this.obj[this.settings.document.import_keys.id_key] :
      this.obj[this.settings.document.export_key];
  }

  get_filename(id = null) {
      if (! id)
        id = this.get_id()
        return this.settings.fs[this.phase] + '/' + id;
  }

  update_keys(mdm_keys) {
    var self = this;
    Object.keys(this.obj).forEach(function (key) {
      mdm_keys.add_key(key)
    });
  }

  save() {
    const filename = this.get_filename()
    const result = yaml.dump(this.obj);
    fs.writeFile(filename, result, (err) => {
      if (err) throw err;
        console.log('The file has been saved!');
    });
  }

  load(id) {
    var self = this;
    const filename = this.get_filename(id)
    fs.stat(filename, function(err, stats) {
      if(err) {
        console.log("cannot open filename "
        + filename
        + ". The error code is " + err.code);
      } else {
        self.obj = yaml.safeLoad(fs.readFileSync(filename, "utf8"))
      }
    });
  }

  add_key(key, value, action="do_not_overwrite") {
    if (key in this.obj && action == "do_not_overwrite") {
      return;
    }
    this.obj[key] = value;
  }

  rename_key(key, new_key) {
    if (key in this.obj) {
      this.obj[new_key] = this.obj[key];
      this.delete_key(key);
    }
  }

  delete_key(key) {
    if (key in this.obj) {
      delete this.obj[key];
    }
  }

  empty() {
    this.obj = {}
  }

  change_keys_case(target_case="lowercase") {
    var self = this;
    Object.keys(this.obj).forEach(function (key) {
      var k;
      var v = self.obj[key]
      switch (target_case.toLowerCase()) {
        case "lowercase":
        k = key.toLowerCase();
        break;
        default:
        k = key.toUpperCase();
      }
      if (k !== key) {
        self.add_key(k, v);
        self.delete_key(key);
      }
    } );
  }

  change_values_case(target_case="lowercase") {
    var obj = this.obj
    Object.keys(obj).forEach(function (key) {
      var v = obj[key];
      if (v.constructor === String) {
        switch (target_case.toLowerCase()) {
          case "lowercase":
          v = v.toLowerCase();
          break;
          default:
          v = v.toUpperCase();
        }
      }
      obj[key] = v;
    });
    this.obj = obj;
  };

  normalize_keys(mdm) {
    var self = this;
    var mdm_keys = mdm.keys.rules;
    console.debug(mdm_keys);
    Object.keys(self.obj).forEach(function (key) {
      console.debug(key);
      if (key in mdm_keys) {
        const action = mdm_keys[key]["action"]
        switch (action) {
          case "delete":
            self.delete_key(key);
            break;
          case "rename":
            var param1 = mdm_keys[key]["param1"];
            self.rename_key(key, param1);
            break;
          default:
            console.log("Normalize_keys: unknown action " + action)
        }
      }
    });
  }

  rename_values(mapping) {
    var obj = this.obj;
    Object.keys(obj).forEach(function (key) {
      var v = obj[key];
      if (v.constructor === String && v in mapping) {
        obj[key] = mapping[v];
      }
    });
    this.obj = obj;
  };

  normalize(mdm) {
    var cmd = null;
    var self = this;
    self.settings.normalizer[self.phase].forEach( function(f) {
      console.log(f);
      switch(f.action.command) {
        case "keys_to_uppercase":
        cmd = 'self.change_keys_case("uppercase")';
        break;
        case "keys_to_lowercase":
        cmd = 'self.change_keys_case("lowercase")';
        break;
        case "normalize_keys":
        cmd = 'self.normalize_keys(mdm)';
        break;
        /*
        case "normalize_values":
        cmd = 'self.normalize_values(mdm)';
        break;
        */
        case "values_to_uppercase":
        cmd = 'self.change_values_case("uppercase")';
        break;
        case "values_to_lowercase":
        cmd = 'self.change_values_case("lowercase")';
        break;
        default:
        console.log("Normalize: unknown command " + cmd)
      }
      console.log(cmd);
      if (cmd.constructor === String) {
        eval(cmd);
      }
    });
  }

}

module.exports = MdmDoc
