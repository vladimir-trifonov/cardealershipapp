define(["backbone", "common/Events", "template!main-view", "views/CarsCollectionView", "views/CarInsertEditView", "views/CarView", "collections/CarsCollection", "collections/ManufacturersCollection"], function(Backbone, Events, template, CarsCollectionView, CarInsertEditView, CarView, CarsCollection, ManufacturersCollection) {
    var MainView = Backbone.View.extend({
        el: "body",

        template: template,

        initialize: function() {
            this.render();
            this.initModelEventHandlers();
        },

        render: function() {
            this.$el.html(this.template());

            this.carsCollection = new CarsCollection();
            this.manufacturersCollection = new ManufacturersCollection();

            new CarInsertEditView({collection: this.carsCollection, manufacturersCollection: this.manufacturersCollection});
            new CarsCollectionView({collection: this.carsCollection});

            this.manufacturersCollection.fetch({reset: true});
            this.carsCollection.fetch({reset: true});

            return this;
        },

        initModelEventHandlers: function() {
            var that = this;

            Events.off("edit.mv").on("edit.mv", function(e, model) {
                new CarInsertEditView({collection: that.carsCollection, manufacturersCollection: that.manufacturersCollection, model: model});
                that.manufacturersCollection.fetch({reset: true});
            });
        },

    });

    return MainView;
});