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

const level = require('level')
var fs = require('fs')

//db.put('example', {"a": 42}, function (err) {


//})

class DB{
  constructor(path, dbname) {
    this.path = path;
    this.dbname = dbname;
    fs.existsSync(path) || fs.mkdirSync(path);
    this.db = level(path + "/" + dbname, { valueEncoding: 'json' })
    this.dbdesc = "DB <" + this.dbname + ">: "
    var self = this;

    const array = ['del', 'put', 'opening', 'ready', 'open', 'closing', 'close'];
    array.forEach(function(action) {
      console.log(self.dbdesc + "activating logging for action "+ action);
      self.db.on(action, function (key, value) {
        console.debug(self.dbdesc + 'action=' + action + ' for key=' + key) // + (value == undefined) ? '' : ' and value=' + value)
      })
    });
  }

  save_raw(id, doc) {
    console.debug(this.dbdesc + "save_raw with id=<"  + id)
    this.db.put(id, doc, function (err)  {
      if (err) {
        console.error('Cannot save document due to err=' + err + ', doc=' + doc);
        throw err;
      }
    });
  }


save_raw_if_new(id, doc) {
      var self = this
      this.db.get(id)
        .then(function (obj) {
          console.log(self.dbdesc + "save_raw_if_new: altrady exixts, not saving")
        })
        .catch(function (err) {
          console.error(err);
          return self.save_raw(id, doc)
        })
    }

  load_raw(id) {
    console.debug(this.dbdesc + "load_raw: with id=" + id)
    // this.db.get(id)
    // .then(function (value) {
    //   console.debug(value)
    //   return value})
    // .catch(function (err) {
    //   console.error(err)
    //   return {} })

    return this.db.get(id);
      //.then(function (value) { callback(value) })
      //.catch(function (err) { console.error(err) })
  }


  save_obj(id, doc, import_id = null) {
    var self = this
    var obj = {}
    if (import_id == null) {
      import_id = id
    }
    console.debug(self.dbdesc + "save_obj: with id=" + id + ' and import_id=' + import_id)
    this.db.get(id)
      .then(function (obj) {
        console.log(self.dbdesc + "save_obj: retreived object ")
        console.log(obj)
        obj[import_id] = doc;
        return self.save_raw(id, obj)
      })
      .catch(function (err) {
        console.error(err);
        obj[import_id] = doc;
        return self.save_raw(id, obj)
      })
  }

  load_obj(id) {
    console.debug(this.dbdesc + "Load_obj: with id=" + id)
    return this.load_raw(id);
  }

  empty() {
    var self = this;
    this.db.createKeyStream()
    .on('data', function (data) {
      console.debug(self.dbdesc +  'deleting key=', data)
        self.db.del(data, function (err) {
          if (err) {
            console.debug(self.dbdesc +  'cannot delete key=', data)
          }
        });
      }) //data
  }

  count(callback) {
    var self = this;
    var count = 0;
    var stream = this.db.createKeyStream()

    stream.on('data', function (data) {
      count = count + 1;
      console.debug(self.dbdesc + 'count: stream DATA count=' + count)
    });
    stream.on('end', function() {
      console.debug(self.dbdesc + 'count: stream END count=' + count)
      callback(count);
    })
    return count;
  }

}
module.exports = DB
