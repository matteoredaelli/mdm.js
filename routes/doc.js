"use strict";

var express = require('express');
var router = express.Router();

var mdm_doc = require('../mdm/mdm_doc');

router.post('/normalize/:step', function(req, res, next) {
    console.debug(req.body);
    console.debug(req.app.locals.Mdm.settings)
    var doc = new mdm_doc(req.body, req.app.locals.Mdm.settings)
    doc.normalize(req.app.locals.Mdm, req.params.step)
    res.send(doc.obj);
});

module.exports = router;
