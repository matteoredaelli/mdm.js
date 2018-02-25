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

var self  = this;

exports.get_unique_key = function(obj) {
  return obj.source + '-' + obj.id;
}
exports.add_key = function(obj, key, value, action="do_not_overwrite") {
  if (key in obj && action == "do_not_overwrite")
    return obj;

  obj[key] = value;
  return obj
}

exports.rename_key = function(obj, key, new_key) {
  if (key in obj) {
    obj[new_key] = obj[key];
    obj.delete_key(key);
  }
  return obj
}

exports.delete_key = function(obj, key) {
  if (key in obj) {
    delete obj[key];
  }
  return obj;
}

exports.change_keys_case = function(obj, target_case="lowercase") {
  Object.keys(obj).forEach(function (key) {
    var k;
    var v = obj[key]
    switch (target_case.toLowerCase()) {
      case "lowercase":
      k = key.toLowerCase();
      break;
      default:
      k = key.toUpperCase();
    }
    if (k !== key) {
      obj = rename_key(obj, k, v);
    }
  });
  return obj;
}

exports.change_values_case = function(obj, target_case="lowercase") {
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
  return obj;
};

exports.keys_with_only_letters_numbers_and_underscores = function(obj) {
  Object.keys(obj).forEach(function (key) {
    new_key = key.replace(/[^a-z0-9_]+/gi, "");
    if (key !== new_key)
      obj = rename_key(obj, key, new_key)
  });
  return obj;
};

exports.normalize_keys = function(obj, rules) {
  Object.keys(obj).forEach(function (key) {
    console.debug(key);
    if (key in rules) {
      let  action = rules[key]["action"];
      switch (action) {
        case "delete":
        obj = delete_key(obj, key);
        break;
        case "rename":
        const param1 = rules[key]["param1"];
        obj = rename_key(obj, key, param1);
        break;
        default:
        console.log("Normalize_keys: unknown action " + action)
      }
    }
  });
  return obj;
}

exports.rename_values = function(obj, mapping) {
  Object.keys(obj).forEach(function (key) {
    var v = obj[key];
    if (v.constructor === String && v in mapping) {
      obj[key] = mapping[v];
    }
  });
  return obj;
};

exports.normalize = function(obj, rules)  {
  rules.forEach( function(f) {
    console.log(f);
    switch(f.action.command) {
      case "keys_to_uppercase":
      obj = self.change_keys_case(obj, "uppercase");
      break;
      case "keys_to_lowercase":
      obj = self.change_keys_case(obj, "lowercase");
      break;
      case "normalize_keys":
      obj = self.normalize_keys(obj, rules);
      break;
      /*
      case "normalize_values":
      cmd = 'self.normalize_values(mdm)';
      break;
      */
      case "values_to_uppercase":
      obj = self.change_values_case(obj, "uppercase");
      break;
      case "values_to_lowercase":
      obj = self.change_values_case(obj, "lowercase");
      break;
      case "keys_with_only_letters_numbers_and_underscores":
      obj = self.keys_with_only_letters_numbers_and_underscores(obj)
      break;
      default:
      console.log("Normalize: unknown command "+ f.action.command);
    }
  });
  return obj;
}
