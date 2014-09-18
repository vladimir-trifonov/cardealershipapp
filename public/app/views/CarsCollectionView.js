define(["backbone", "common/Events", "jquery", "template!cars-collection-view", "models/CarModel", "views/CarView", "colorbox", 'async!http://maps.google.com/maps/api/js?sensor=false'], function(Backbone, Events, $, template, carModel, CarView) {
    var CarsCollectionView = Backbone.View.extend({
        el: ".cars-collection-container",

        template: template,

        initialize: function(options) {
            var that = this;

            _.bindAll(this, "removeFilterEventHandler",
                "removeFilter",
                "inStockFilterEventHandler",
                "inStockFilter");

            this.render();
            this.initHandlers();
        },

        render: function() {
            this.$el.html(this.template());
            return this;
        },

        initHandlers: function() {
            var that = this;
            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'reset', this.addAll);

            this.$("#inStock-filter-link").off('click').on("click", this.inStockFilterEventHandler);
            this.$("#all-filter-link").off('click').on("click", this.removeFilterEventHandler);

            Events.off("beforeEdit.ccv").on("beforeEdit.ccv", function() {
                that.$(".active").removeClass('active');
            });

            Events.off("cancel.ccv").on("cancel.ccv", function() {
                that.removeCurrentItemHighlightState();
            });

            Events.off("change.ccv").on("change.ccv", function(e, model) {
                if (that.hasInStockFilter) {
                    that.inStockFilter()
                }
            });

            this.initGoogleMapsHandlers();
        },

        addOne: function(model) {
            var view = new CarView({
                model: model
            });

            this.$('.cars-items-wrapper').append(view.render().el);

            if (this.hasInStockFilter) {
                this.inStockFilter();
            }
        },

        addAll: function() {
            this.collection.each(this.addOne, this);
        },

        initGoogleMapsHandlers: function() {
            var that = this;

            this.$el.find("a.map-link").colorbox({
                html: '<div id="map_canvas_all" style="width:600px; height:450px;"></div>',
                scrolling: false,
                width: "600px",
                height: "470px",
                onComplete: function() {
                    var mapCenterCoords = new google.maps.LatLng(42.7500, 25.5000);
                    var myOptionsG = {
                        zoom: 7,
                        center: mapCenterCoords,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    }
                    var mapG = new google.maps.Map(document.getElementById("map_canvas_all"), myOptionsG);

                    that.collection.each(function(el) {
                        var longCoord = el.get('geoLocationLong'),
                            latCoord = el.get('geoLocationLat'),
                            manufacturer = el.get('manufacturer'),
                            modelOfCar = el.get('modelOfCar'),
                            licensePlate = el.get('licensePlate');

                        var markerCoords = new google.maps.LatLng(latCoord, longCoord);

                        new google.maps.Marker({
                            position: markerCoords,
                            map: mapG,
                            title: "Type: " + manufacturer + " " + modelOfCar + " Plate: " + licensePlate
                        });

                    });
                }
            })
        },

        removeCurrentItemHighlightState: function() {
            this.$('.carView.active').removeClass('active');
        },

        removeFilterEventHandler: function(e) {
            e.preventDefault();
            this.removeFilter();
        },

        removeFilter: function() {
            this.hasInStockFilter = false;
            this.$("#inStock-filter-link").show();
            this.$("#all-filter-link").hide();
            this.$('.carView').each(function() {
                $(this).css('display', '');
            });
        },

        inStockFilterEventHandler: function(e) {
            e.preventDefault();
            this.inStockFilter();
        },
        inStockFilter: function() {
            this.hasInStockFilter = true;
            this.$("#inStock-filter-link").hide();
            this.$("#all-filter-link").show();
            this.$('.carView').each(function() {
                var $el = $(this);
                if ($el.data('instock') !== true) {
                    $el.css('display', 'none');
                } else {
                    $(this).css('display', '');
                }
            });
        }
    });

    return CarsCollectionView;
});