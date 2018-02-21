"use strict";

var express = require('express');
var router = express.Router();

    
/* GET keys listing. */
router.get('/', function(req, res, next) {
    res.send(JSON.stringify(req.app.locals.Mdm.keys.keys));
});

router.post('/add/:value', function(req, res, next) {
    req.app.locals.Mdm.keys.add_key(req.params.value)
    res.send('ok');
});

router.post('/empty', function(req, res, next) {
    req.app.locals.Mdm.keys.empty();
    res.send('ok');
});

router.post('/load', function(req, res, next) {
    req.app.locals.Mdm.keys.load()
    res.send('ok');
});

router.post('/save', function(req, res, next) {
    req.app.locals.Mdm.keys.save()
    res.send('ok');
});

module.exports = router;
