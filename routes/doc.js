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

var mdm_doc = require('../mdm/mdm_doc');

router.post('/import', function(req, res, next) {
  console.debug(req.body);
  var doc = new mdm_doc(req.body, req.app.locals.Mdm.settings, 'import')
  doc.normalize(req.app.locals.Mdm)
  doc.update_keys(req.app.locals.Mdm.keys)
  doc.save()
  res.send("ok\n");
});

router.post('/normalize/:phase', function(req, res, next) {
  console.trace(req.body);
  var doc = new mdm_doc(req.body, req.app.locals.Mdm.settings, req.params.phase)
  doc.normalize(req.app.locals.Mdm)
  res.send(doc.obj);
});

module.exports = router;
