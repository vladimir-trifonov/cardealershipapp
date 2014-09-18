define(["backbone", "jquery", "underscore", "template!car-view", "common/Events"], function(Backbone, $, _, template, Events) {
	var CarView = Backbone.View.extend({
		template: template,

		tagName: "tr",
		className : "carView",

		events: {
			"click .label-wrapper": "edit",
			"click .destroy": "clear"
		},

		initialize: function(options) {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},

		render: function() {
			var modelJson = this.model.toJSON();
			this.$el.html(this.template(modelJson));
			this.$el.data("instock", this.model.get('inStock'));
			return this;
		},

		edit: function() {
			Events.trigger("beforeEdit", this.model);
			this.$el.closest('.carView').addClass('active');
			Events.trigger("edit", this.model);
		},

		clear: function(e) {
			e.stopImmediatePropagation();
			Events.trigger("destroy", this.model);
			this.model.destroy();
		}

	});

	return CarView;
});