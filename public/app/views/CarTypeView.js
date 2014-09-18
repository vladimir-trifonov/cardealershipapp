define(["backbone", "jquery", "underscore"], function(Backbone, $, _) {
    var CarTypeView = Backbone.View.extend({
        tagName: "option",

        initialize: function() {
            _.bindAll(this, 'render');
        },

        render: function() {
            $(this.el).attr('value', this.model.get('name')).html(this.model.get('name'));
            return this;
        }
    });

    return CarTypeView;
});