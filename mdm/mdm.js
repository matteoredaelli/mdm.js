"use strict";

var mdm_keys = require('./mdm_keys');
var mdm_values = require('./mdm_values');

class Mdm {
    constructor(settings) {
	this.settings = settings
	this.keys = new mdm_keys(settings.fs.keys_file)
	this.values = new mdm_values(settings.fs.values_file)
	this.load()
    }
    
    save() {
	this.keys.save();
	this.values.save();
    }
    
    load() {
	this.keys.load();
	this.values.load();
    }
    
    empty() {
	this.keys = new mdm_keys()
	this.values = new mdm_values()
	this.keys.save()
	this.values.save()
    }
    
}

module.exports = Mdm
