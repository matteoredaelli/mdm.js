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


/* GET keys listing. */
router.get('/', function(req, res, next) {
  res.send(JSON.stringify(req.app.locals.Mdm.values));
});

router.post('/add/:key/:value', function(req, res, next) {
  req.app.locals.Mdm.values.add_value(req.params.key, req.params.value)
  res.send('ok');
});

router.post('/empty', function(req, res, next) {
  req.app.locals.Mdm.values.empty();
  res.send('ok');
});

router.post('/load', function(req, res, next) {
  req.app.locals.Mdm.values.load()
  res.send('ok');
});

router.post('/save', function(req, res, next) {
  req.app.locals.Mdm.values.save()
  res.send('ok');
});

module.exports = router;
