define(function(require, exports, module) {
    "use strict";

    var Backbone = require("backbone"),
        manufacturerModel = require("models/ManufacturerModel");

    var ManufacturersCollection = Backbone.Collection.extend({

    	url: '/public/app/data/Manufacturers/init.json',
    	model: manufacturerModel,
    });

    module.exports = ManufacturersCollection;
});