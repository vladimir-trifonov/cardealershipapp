define(["backbone", "common/Events", "jquery", "views/CarTypesView"], function(Backbone, Events, $, CarTypesView) {
	var ManufacturerView = CarTypesView.extend({
		setSelectedId: function(manufacturer) {
			var $modelOfCarView = $(this.modelOfCarView.el);

			if (manufacturer === "") {
				$modelOfCarView.attr('disabled', true);
				this.modelOfCarView.collection.reset();
			} else {
				this.modelOfCarView.collection.url =
					"/public/app/data/Manufacturers/ModelsOfCar/" + manufacturer + ".json";
				this.modelOfCarView.collection.fetch({
					reset: true
				});
				$modelOfCarView.attr('disabled', false);
			}
		}
	});

	return ManufacturerView;
});