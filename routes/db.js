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

var express = require('express');
var router = express.Router();

router.get('/count/:db', function(req, res, next) {
  //console.debug('\x1b[33m%s\x1b[0m: ', obj);
  //obj = req.app.locals.Mdm.import_document(obj, "import")
  //const tot = req.app.locals.Mdm.db[req.params.db].count(res.send)

    var count = 0;

    var stream = req.app.locals.Mdm.db[req.params.db].db.createKeyStream()

    stream.on('data', function (data) {
      count = count + 1;
      console.debug('count: stream DATA count=' + count)
    });
    stream.on('end', function() {
      console.debug('count: stram END count=' + count)
      res.send({"count": count});
    })
  //res.send({"count": tot});
});

router.post('/empty/:db', function(req, res, next) {
  //console.debug('\x1b[33m%s\x1b[0m: ', obj);
  //obj = req.app.locals.Mdm.import_document(obj, "import")
  req.app.locals.Mdm.db[req.params.db].empty()
  res.send("ok");
});

router.post('/step/:from/:to', function(req, res, next) {
  //console.debug('\x1b[33m%s\x1b[0m: ', obj);
  //obj = req.app.locals.Mdm.import_document(obj, "import")
  //const tot = req.app.locals.Mdm.db[req.params.db].count(res.send)

    req.setTimeout(0) 

    var result = 0;
    const from = req.params.from;
    const to   = req.params.to;
    console.debug("DB step from=" + from + ', to=' + to)

    var stream = req.app.locals.Mdm.db[from].db.createValueStream()

    stream.on('data', function (data) {
      req.app.locals.Mdm.step(to, data)
      result = result + 1;
    });
    stream.on('end', function() {
      console.debug(from + ': stream END' )
      res.setHeader('Content-Type', 'text/json');
      res.send({"count" :result});
    })
  //res.send({"count": tot});
});


router.get('/export/csv/:db', function(req, res, next) {
  //console.debug('\x1b[33m%s\x1b[0m: ', obj);
  //obj = req.app.locals.Mdm.import_document(obj, "import")
  //const tot = req.app.locals.Mdm.db[req.params.db].count(res.send)

    req.setTimeout(0) 

    var result = "";

    var stream = req.app.locals.Mdm.db[req.params.db].db.createValueStream()

    stream.on('data', function (data) {
      if (result === "") {
        result = result + Object.keys(data).join(";") + "\n";
      }
      result = result + Object.values(data).join(";") + "\n";
    });
    stream.on('end', function() {
      console.debug('export: stream END' )
      res.setHeader('Content-Type', 'text/csv');
      res.send(result);
    })
  //res.send({"count": tot});
});

router.get('/export/kv/:db', function(req, res, next) {
  //console.debug('\x1b[33m%s\x1b[0m: ', obj);
  //obj = req.app.locals.Mdm.import_document(obj, "import")
  //const tot = req.app.locals.Mdm.db[req.params.db].count(res.send)

    var result = "";

    var stream = req.app.locals.Mdm.db[req.params.db].db.createReadStream()

    stream.on('data', function (data) {
      result = result + data.key + ";" + data.value + "\n";
    });
    stream.on('end', function() {
      console.debug('export: stream END' )
      res.setHeader('Content-Type', 'text/csv');
      res.send(result);
    })
  //res.send({"count": tot});
});

module.exports = router;
