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
  const tot = req.app.locals.Mdm.db[req.params.db].count()
  res.send({"count": tot});
});

router.post('/empty/:db', function(req, res, next) {
  //console.debug('\x1b[33m%s\x1b[0m: ', obj);
  //obj = req.app.locals.Mdm.import_document(obj, "import")
  req.app.locals.Mdm.db[req.params.db].empty()
  res.send("ok");
});

module.exports = router;
