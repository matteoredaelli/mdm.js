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

exports.convert_value_string = function(value) {
  var new_value = value;
  switch(value) {
    case "true":
    case true:
    new_value = true
    break;
    case "false":
    case false:
    new_value = false
    case 'null':
    new_value = null
    break;
    default:
    new_value = value;
  }
  return new_value;
}

exports.get_unique_key = function(obj) {
  console.log(obj)
  return obj.source + '-' + obj.id;
}

exports.add_key = function(obj, key, value, overwrite=false) {
  if (key in obj && overwrite)
    return obj;
  console.debug("      new_key: key= '" + key + "'");
  obj[key] = value;
  return obj
}

exports.rename_key = function(obj, key, new_key, overwrite=false) {
  var self = this;
  if (key in obj) {
    if (overwrite || (! (new_key in obj))) {
      console.debug("      rename_key: key= '" + key +  "', new_key='" + new_key + "'");
      obj[new_key] = obj[key];
    }
    obj = self.delete_key(obj, key);
  }
  return obj
}

exports.delete_key = function(obj, key) {
  if (key in obj) {
    console.debug("      delete_key: key= '" + key + "'");
    delete obj[key];
  }
  return obj;
}

exports.change_keys_case = function(obj, target_case="lowercase", filter) {
  var self = this;
  Object.keys(obj).forEach(function (key) {
    if (!filter.keys || key.match(filter.keys)) {
      var new_key;
      switch (target_case.toLowerCase()) {
        case "lowercase":
        new_key = key.toLowerCase();
        break;
        default:
        new_key = key.toUpperCase();
      }
      if (new_key !== key) {
        console.debug("      change_keys_case: key= '" + key +  "', new_key='" + new_key + "'");
        obj = self.rename_key(obj, key, new_key);
      }
    }
  });
  return obj;
}

exports.change_values_case = function(obj, target_case="lowercase", filter) {
  Object.keys(obj).forEach(function (key) {
    if (!filter.keys || key.match(filter.keys)) {
      var v = obj[key];
      var new_value = v;
      if (v.constructor === String) {
        switch (target_case.toLowerCase()) {
          case "lowercase":
          new_value = v.toLowerCase();
          break;
          default:
          new_value = v.toUpperCase();
        }
      }
      if (v !== new_value) {
        console.debug("...   change_values_case: key= '" + key + "', old value='" + v + "', new_value='" + new_value + "'");
        obj[key] = new_value;
      }
    }
  });
  return obj;
};

exports.keys_with_only_letters_numbers_and_underscores = function(obj) {
  var self = this;
  Object.keys(obj).forEach(function (key) {
    let new_key = key.replace(/[^a-z0-9_]+/gi, "");
    if (key !== new_key)
      obj = self.rename_key(obj, key, new_key)
  });
  return obj;
};

exports.keys_delete = function(obj, filter) {
  Object.keys(obj).forEach(function (key) {
    if ( (!filter.keys || key.match(filter.keys))) {
      console.debug("      keys_delete: key= '" + key + "'");
      obj = self.delete_key(obj, key)
    }
  });
  return obj;
};

exports.key_add = function(obj, filter, new_key, value, overwrite=false) {
  var self = this;
  var new_value = self.convert_value_string(value);

  Object.keys(obj).forEach(function (key) {
    var v = obj[key];
    if ( (!filter.keys || key.match(filter.keys)) &&
     (!filter.values || v.match(filter.values))) {
       if (overwrite || (! (new_key in obj))) {
         obj = self.add_key(obj, new_key, new_value)
       }
     }
  });
  return obj;
};

exports.keys_replace = function(obj, filter, value) {
  var self = this;
  var new_value = self.convert_value_string(value);
  Object.keys(obj).forEach(function (key) {
    var v = obj[key];
    if ( (!filter.keys || key.match(filter.keys))) {
       switch(new_value) {
         case "true":
         case true:
         obj[key] = true
         break;
         case "false":
         case false:
         obj[key] = false
         break;
        default:
         let new_key = key.replace(filter.values, new_value)
         console.debug("......keys_replace: old_key= '" + key + "', new_key='" + new_key + "'");
         obj = self.rename_key(obj, key, new_key)
         break;
       }
    }
  });
  return obj;
};

exports.values_replace = function(obj, filter, new_value) {
  Object.keys(obj).forEach(function (key) {
    var v = obj[key];
    if (!v || v.constructor !== String)
      v = '';
    if ( (!filter.keys || key.match(filter.keys)) &&
     (!filter.values || v.match(filter.values))) {
       switch(new_value) {
         case "true":
         case true:
         obj[key] = true
         break;
         case "false":
         case false:
         obj[key] = false
         case 'null':
         obj[key] = null
         break;
         default:
         obj[key] = v.replace(filter.values, new_value)
         console.debug("......values_replace: key= '" + key + "', old value='" + v + "', new_value='" + obj[key] + "'");
         break;
       }
     }
  });
  return obj;
};

exports.normalize = function(obj, rules)  {
  var self = this;
  rules.forEach( function(f) {
    let keys = f.filter && f.filter.keys ? eval(f.filter.keys) : /^.*$/;
    let values = f.filter && f.filter.values ? eval(f.filter.values) : /^.*$/;
    let filter = {keys: keys, values: values};
    console.debug("Normalize: entering new rule='" + f.action.command + "' with filters: keys='" + keys + "', values='" + values);
        console.debug("  before the document has " + Object.keys(obj).length + ' keys');
    switch(f.action.command) {
      case "key_add":
      obj = self.key_add(obj, filter, f.action.param1, f.action.param2, f.action.param3);
      break;
      case "keys_delete":
      obj = self.keys_delete(obj, filter);
      break;
      case "keys_to_uppercase":
      obj = self.change_keys_case(obj, "uppercase", filter);
      break;
      case "keys_to_lowercase":
      obj = self.change_keys_case(obj, "lowercase", filter);
      break;
      case "keys_replace":
      obj = self.keys_replace(obj, filter, f.action.param1);
      break;
      case "values_replace":
      obj = self.values_replace(obj, filter, f.action.param1);
      break;
      case "values_to_uppercase":
      obj = self.change_values_case(obj, "uppercase", filter);
      break;
      case "values_to_lowercase":
      obj = self.change_values_case(obj, "lowercase", filter);
      break;
      case "keys_with_only_letters_numbers_and_underscores":
      obj = self.keys_with_only_letters_numbers_and_underscores(obj, filter)
      break;
      default:
      console.log("   unknown command "+ f.action.command);
    } // end switch
    console.debug("   after the document has " + Object.keys(obj).length + ' keys');
  });

  return obj;
}