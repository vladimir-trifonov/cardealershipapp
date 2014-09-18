define(function(require, exports, module) {
	"use strict";

	var Backbone = require("backbone"),
		localstorage = require("localstorage"),
		carModel = require("models/CarModel");

	var CarsCollection = Backbone.Collection.extend({

		model: carModel,

		localStorage: new Backbone.LocalStorage('cars-collection'),

		inStock: function() {
			return this.where({
				inStock: true
			});
		},

		nextOrder: function() {
			if (!this.length) {
				return 1;
			}
			return this.last().get('order') + 1;
		},

		comparator: 'order'
	});

	module.exports = CarsCollection;
});