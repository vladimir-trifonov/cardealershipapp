define(function(require, exports, module) {
    "use strict";

    var Backbone = require("backbone"),
        modelOfCarModel = require("models/ModelOfCarModel");

    var ModelsOfCarCollection = Backbone.Collection.extend({
    	model: modelOfCarModel
    });

    module.exports = ModelsOfCarCollection;
});