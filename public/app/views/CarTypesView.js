define(["backbone", "jquery", "views/CarTypeView"], function(Backbone, $, CarTypeView) {
	var CarTypesView = Backbone.View.extend({

		initialize: function() {
			_.bindAll(this, 'addOne', 'addAll');
			this.collection.bind('reset', this.addAll);
		},

		events: {
			"change": "changeSelected"
		},

		addOne: function(manufacturer) {
			var carTypeView = new CarTypeView({ model: manufacturer });
		    this.carTypesView.push(carTypeView);
		    $(this.el).append(carTypeView.render().el);
		},

		addAll: function() {
			_.each(this.carTypesView, function(carTypeView) { carTypeView.remove(); });
		    this.carTypesView = [];
		    this.collection.each(this.addOne);
		    $(this.el).trigger('loaded');
		},

		changeSelected: function() {
			this.setSelectedId($(this.el).val());
		}
	});

	return CarTypesView;
});